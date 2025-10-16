
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, AvatarMood, AvatarSettings } from "@/lib/types";
import { getAiResponse, getSynthesizedSpeech } from "@/app/actions";
import { useUser, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, doc, onSnapshot, addDoc, query, orderBy, limit, Timestamp } from 'firebase/firestore';
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
  const [isClient, setIsClient] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);


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
  
  // Effect for fetching avatar settings
  useEffect(() => {
    setIsClient(true);
    if (!settingsDocRef) return;
    const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
            setSettings(docSnap.data() as AvatarSettings);
        } else {
            // If no settings exist, create them with default values
            setDocumentNonBlocking(settingsDocRef, settings, { merge: true });
        }
    }, (error) => {
        console.error("Error fetching settings:", error);
    });
    return () => unsubscribe();
  }, [settingsDocRef]);

  // Effect for fetching conversation history
  useEffect(() => {
    if (!latestConversationQuery) return;
    const unsubConversations = onSnapshot(latestConversationQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
            const conversationDoc = querySnapshot.docs[0];
            setCurrentConversationId(conversationDoc.id);
            const messagesRef = collection(firestore!, `users/${user!.uid}/conversations/${conversationDoc.id}/messages`);
            const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
            
            const unsubMessages = onSnapshot(messagesQuery, (messagesSnapshot) => {
                const fetchedMessages = messagesSnapshot.docs.map(doc => doc.data() as Message);
                setConversation(fetchedMessages);
            }, (error) => {
                console.error("Error fetching messages:", error);
                setConversation([]);
            });
            
            return () => unsubMessages();
        } else {
            // No conversations exist, create one
            if(conversationColRef) {
                addDocumentNonBlocking(conversationColRef, { timestamp: Timestamp.now() }).then(docRef => {
                    if (docRef) {
                      setCurrentConversationId(docRef.id);
                    }
                });
            }
            setConversation([]);
        }
    }, (error) => {
        console.error("Error fetching conversation:", error);
    });

    return () => unsubConversations();
}, [latestConversationQuery, firestore, user, conversationColRef]);


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

    setMessage("");
    setIsProcessing(true);
    setAvatarMood("thinking");
  
    const userMessage: Message = { role: "user", content: textToSend };
    // Optimistically update UI
    setConversation(prev => [...prev, userMessage]);
  
    try {
        const aiResponse = await getAiResponse([...conversation, userMessage], textToSend);
        const assistantMessage: Message = { role: "assistant", content: aiResponse };
        
        // Save messages to Firestore (optimistic UI update already done)
        if (firestore && conversationColRef && currentConversationId) {
            const messagesRef = collection(firestore, conversationColRef.path, currentConversationId, 'messages');
            addDocumentNonBlocking(messagesRef, { ...userMessage, timestamp: Timestamp.now() });
            addDocumentNonBlocking(messagesRef, { ...assistantMessage, timestamp: Timestamp.now() });

            // We only update the conversation state after the AI response is back
            // to avoid showing a message that hasn't been persisted yet.
            // The onSnapshot listener will eventually pick up the change, but this is faster.
            setConversation(prev => [...prev, assistantMessage]);
        }
        
        speak(aiResponse);

    } catch(e) {
      console.error(e);
      const errorMessage = { role: "assistant", content: "Sorry, I had trouble generating a response." } as Message;
      setConversation(prev => [...prev, errorMessage]);
      speak(errorMessage.content);
    } finally {
      setIsProcessing(false);
      // Let speak() control the mood, so we don't prematurely set it to neutral
    }
  }, [message, isProcessing, conversation, speak, firestore, conversationColRef, currentConversationId]);

  const handleTranscript = useCallback((transcript: string) => {
      if (transcript) {
        handleSendMessage(transcript);
      }
      setIsListening(false);
  }, [handleSendMessage]);
  
  useEffect(() => {
    const recognitionAvailable = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
    setSpeechRecognitionAvailable(recognitionAvailable);
    setIsClient(true);

    if (!recognitionAvailable) {
        console.log("Speech recognition not available.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.lang = 'en-US';
    recognition.continuous = false; // Process after a single utterance
    recognition.interimResults = false;
    
    recognition.onstart = () => {
        setIsListening(true);
    };
    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognition.onresult = (event) => {
        const finalTranscript = event.results[0][0].transcript;
        handleTranscript(finalTranscript);
    };
    
    recognition.onerror = (event) => {
      if (event.error === 'aborted') {
          console.log('Speech recognition aborted.');
          return;
      };
      let errorMsg = `An error occurred: ${event.error}.`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings.";
      }
      setVoiceError(errorMsg);
      setIsListening(false);
    };
    
    return () => recognitionRef.current?.abort();
  }, [handleTranscript]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);
  

  const toggleListening = () => {
    if (isProcessing || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start voice recognition:", error);
        setVoiceError("Could not start voice recognition. Please ensure permissions are enabled and try again.");
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
      stopSpeaking();
      setConversation([]);
      if(conversationColRef) {
        // Start a new conversation document
        const newConvDoc = await addDoc(conversationColRef, { timestamp: Timestamp.now() });
        setCurrentConversationId(newConvDoc.id);
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

    