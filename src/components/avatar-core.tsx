
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, AvatarMood, AvatarSettings } from "@/lib/types";
import { getAiResponse, getSynthesizedSpeech } from "@/app/actions";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, onSnapshot, addDoc, query, orderBy, limit } from 'firebase/firestore';
import { setDocumentNonBlocking, addDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import AvatarHeader from "./avatar-header";
import AvatarDisplay from "./avatar-display";
import ChatPanel from "./chat-panel";
import SettingsPanel from "./settings-panel";
import { useToast } from "@/hooks/use-toast";

const AvatarCore = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [settings, setSettings] = useState<AvatarSettings>({
    avatarUrl: "6549c5e1b68e59e8f3f5e4d1",
    volume: 1.0,
    speechRate: 1.0,
    voiceName: "Algenib",
  });

  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [avatarMood, setAvatarMood] = useState<AvatarMood>("neutral");
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isClient, setIsClient] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const settingsDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}/avatarSettings`, "default");
  }, [user, firestore]);
  
  const conversationColRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/conversations`);
  }, [user, firestore]);

  const latestConversationQuery = useMemoFirebase(() => {
      if (!conversationColRef) return null;
      return query(conversationColRef, orderBy("timestamp", "desc"), limit(1));
  }, [conversationColRef]);

  const messagesColRef = useMemoFirebase(() => {
      if (!latestConversationQuery) return null;
      // This part is tricky as we need to get the latest conversation doc first
      // We'll handle this inside the effect.
      return null;
  }, [latestConversationQuery]);
  
  // Effect for fetching avatar settings
  useEffect(() => {
    setIsClient(true);
    if (!settingsDocRef) return;
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setSettings(docSnap.data() as AvatarSettings);
        } else {
            setDocumentNonBlocking(settingsDocRef, settings, { merge: true });
        }
    }, (error) => {
        console.error("Error fetching settings:", error);
        toast({
            variant: "destructive",
            title: "Error loading settings",
            description: "Could not load your saved settings."
        });
    });
    return () => unsubscribe();
  }, [settingsDocRef]);

  // Effect for fetching conversation history
  useEffect(() => {
    if (!latestConversationQuery) return;
    const unsubConversations = onSnapshot(latestConversationQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
            const conversationDoc = querySnapshot.docs[0];
            const messagesRef = collection(firestore!, `users/${user!.uid}/conversations/${conversationDoc.id}/messages`);
            const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
            
            const unsubMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
                const fetchedMessages = messagesSnapshot.docs.map(doc => doc.data() as Message);
                setConversation(fetchedMessages);
            });
            
            return () => unsubMessages();
        } else {
            setConversation([]);
        }
    }, (error) => {
        console.error("Error fetching conversation:", error);
    });

    return () => unsubConversations();
}, [latestConversationQuery, firestore, user]);


  const handleUpdateSettings = (newSettings: AvatarSettings) => {
      setSettings(newSettings);
      if (settingsDocRef) {
          setDocumentNonBlocking(settingsDocRef, newSettings, { merge: true });
      }
  };
  
  const speak = useCallback(async (text: string) => {
    if (!text || !isClient) return;

    setIsSpeaking(true);
    setAvatarMood("talking");

    const audioDataUri = await getSynthesizedSpeech(text, settings.voiceName);

    if (audioDataUri) {
      if (audioRef.current) {
        audioRef.current.src = audioDataUri;
        audioRef.current.volume = settings.volume;
        // The playback rate for <audio> elements is not the same as SpeechSynthesis.
        // It's not directly applied here but could be with audioRef.current.playbackRate.
        // For simplicity, we'll control rate via the TTS generation if the API supports it.
        audioRef.current.play().catch(e => console.error("Audio playback error:", e));

        audioRef.current.onended = () => {
          setIsSpeaking(false);
          setAvatarMood("neutral");
        };
        audioRef.current.onerror = (e) => {
            console.error("Audio element error:", e);
            setIsSpeaking(false);
            setAvatarMood("neutral");
        }
      }
    } else {
        // Fallback or error handling
        setIsSpeaking(false);
        setAvatarMood("neutral");
        toast({
            variant: "destructive",
            title: "Speech Synthesis Failed",
            description: "Could not generate audio for the response."
        });
    }
  }, [isClient, settings.voiceName, settings.volume, toast]);
  
  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isProcessing) return;

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  
    setMessage("");
    setIsProcessing(true);
    setAvatarMood("thinking");
  
    const userMessage: Message = { role: "user", content: textToSend };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
  
    try {
      const aiResponse = await getAiResponse(newConversation, textToSend);
      const assistantMessage: Message = { role: "assistant", content: aiResponse };

      // Save messages to Firestore
      if(conversationColRef) {
          const conversationDoc = (await onSnapshot(query(conversationColRef, orderBy("timestamp", "desc"), limit(1)), (snapshot) => snapshot).get()).docs[0];
          let conversationId = conversationDoc?.id;
          if(!conversationId) {
             const newConvDoc = await addDoc(conversationColRef, { timestamp: new Date() });
             conversationId = newConvDoc.id;
          }
          const messagesRef = collection(firestore!, conversationColRef.path, conversationId, 'messages');
          await addDocumentNonBlocking(messagesRef, {...userMessage, timestamp: new Date() });
          await addDocumentNonBlocking(messagesRef, {...assistantMessage, timestamp: new Date() });
      }

      speak(aiResponse);

    } catch(e) {
      console.error(e);
      const errorMessage = "Sorry, I had trouble generating a response.";
      speak(errorMessage);
    } finally {
      setIsProcessing(false);
      setTimeout(() => {
        if (!isSpeaking) {
           setAvatarMood("neutral");
        }
      }, 200);
    }
  }, [message, isProcessing, isListening, conversation, speak, conversationColRef, firestore, isSpeaking]);
  
  useEffect(() => {
    const recognitionAvailable = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechRecognitionAvailable(recognitionAvailable);

    if (!recognitionAvailable) {
        console.log("Speech recognition not available.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.lang = 'en-US';
    recognition.continuous = true;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        handleSendMessage(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      // Error handling logic remains the same
      if (event.error === 'aborted') return;
      let errorMsg = `An error occurred: ${event.error}.`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone permissions.";
      }
      setVoiceError(errorMsg);
      setIsListening(false);
    };
    
    return () => recognitionRef.current?.abort();
  }, [handleSendMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);
  
  // This useEffect is no longer needed as we're not using browser voices
  // but we keep it for client-side check.
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleListening = () => {
    if (isProcessing || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        recognitionRef.current.start();
      } catch (error) {
        setVoiceError("Could not start voice recognition. Please ensure permissions are enabled.");
        setIsListening(false);
      }
    }
  };
  
  const stopSpeaking = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
    setAvatarMood("neutral");
  };

  const clearConversation = async () => {
      setConversation([]);
      stopSpeaking();
      if(conversationColRef) {
          const snapshot = await onSnapshot(query(conversationColRef, orderBy("timestamp", "desc"), limit(1)), (snapshot) => snapshot).get();
          if(!snapshot.empty){
              const docId = snapshot.docs[0].id;
              // Ideally, you would delete subcollections with a cloud function.
              // For the client, we'll just start a new conversation document.
              await addDoc(conversationColRef, { timestamp: new Date() });
          }
      }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <audio ref={audioRef} className="hidden" />
      <AvatarHeader isSpeaking={isSpeaking} openSettings={() => setShowSettingsPanel(true)} />
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <AvatarDisplay 
          avatarUrl={settings.avatarUrl} 
          avatarMood={avatarMood}
          isSpeaking={isSpeaking}
          onStopSpeaking={stopSpeaking}
        />
        <ChatPanel 
          conversation={conversation}
          isProcessing={isProcessing}
          messagesEndRef={messagesEndRef}
          message={message}
          setMessage={setMessage}
          handleSendMessage={() => handleSendMessage()}
          isListening={isListening}
          toggleListening={toggleListening}
          speechRecognitionAvailable={speechRecognitionAvailable}
          clearConversation={clearConversation}
          voiceError={voiceError}
          setVoiceError={setVoiceError}
        />
      </main>

      {showSettingsPanel && (
        <SettingsPanel
          settings={settings}
          setSettings={handleUpdateSettings}
          closePanel={() => setShowSettingsPanel(false)}
        />
      )}
    </div>
  );
};

export default AvatarCore;
