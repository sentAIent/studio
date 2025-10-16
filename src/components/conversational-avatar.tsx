
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, AvatarMood, AvatarSettings } from "@/lib/types";
import { getAiResponse } from "@/app/actions";
import useLocalStorage from "@/hooks/use-local-storage";
import AvatarHeader from "./avatar-header";
import AvatarDisplay from "./avatar-display";
import ChatPanel from "./chat-panel";
import SettingsPanel from "./settings-panel";

const ConversationalAvatar = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [settings, setSettings] = useLocalStorage<AvatarSettings>("avatar-settings", {
    avatarUrl: "6549c5e1b68e59e8f3f5e4d1",
    volume: 1.0,
    speechRate: 1.0,
    voiceName: null,
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

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);
  
  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    
    const synth = window.speechSynthesis;
    synth.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.rate = settings.speechRate;
    utterance.pitch = 1.0;
    utterance.volume = settings.volume;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAvatarMood("talking");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setAvatarMood("neutral");
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setAvatarMood("neutral");
    };

    synth.speak(utterance);
  }, [selectedVoice, settings.speechRate, settings.volume]);

  const handleSendMessage = useCallback(async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim() || isProcessing) return;

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    setMessage("");
    setIsProcessing(true);
    setAvatarMood("thinking");

    const userMessage: Message = { role: "user", content: textToSend };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);

    try {
      const aiResponse = await getAiResponse(newConversation, textToSend);
      
      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(aiResponse);
    } catch(e) {
      console.error(e);
      const errorMessage = "Sorry, I had trouble generating a response.";
      const assistantMessage: Message = { role: "assistant", content: errorMessage };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(errorMessage);
    } finally {
      setIsProcessing(false);
      if (!isSpeaking) {
         setAvatarMood("neutral");
      }
    }
  }, [message, isProcessing, isListening, conversation, speak, isSpeaking]);

  useEffect(() => {
    if(!isMounted) return;

    synthRef.current = window.speechSynthesis;
    const loadVoices = () => {
      if(!synthRef.current) return;
      const availableVoices = synthRef.current.getVoices();
      if (availableVoices.length === 0) return;
      setVoices(availableVoices);
      
      let voiceToSelect: SpeechSynthesisVoice | undefined;
      if (settings.voiceName) {
        voiceToSelect = availableVoices.find(v => v.name === settings.voiceName);
      }
      if (!voiceToSelect) {
        voiceToSelect = availableVoices.find(v => v.lang.startsWith('en-US')) || 
                        availableVoices.find(v => v.lang.startsWith('en')) || 
                        availableVoices[0];
      }
      setSelectedVoice(voiceToSelect || null);
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSpeechRecognition = !!SpeechRecognition;
    setSpeechRecognitionAvailable(hasSpeechRecognition);

    if (hasSpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
        }
        if (finalTranscript) {
          handleSendMessage(finalTranscript.trim());
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'aborted') {
          return;
        }
        console.error("Speech recognition error:", event.error, event.message);
        let errorMsg = `An error occurred: ${event.error}.`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings.";
        } else if (event.error === 'no-speech') {
          errorMsg = "No speech detected. Please try again.";
        } else if (event.error === 'network') {
          errorMsg = "A network error occurred with the speech recognition service.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Audio capture failed. Your microphone might be in use by another application.";
        }
        setVoiceError(errorMsg);
        setIsListening(false);
      };
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
        setVoiceError("Voice recognition is not supported on this browser. For best results, use Google Chrome.");
    }

    return () => {
      recognitionRef.current?.abort();
      synthRef.current?.cancel();
    };
  }, [isMounted, settings.voiceName, handleSendMessage]);

  useEffect(() => {
    if (voices.length > 0) {
      const voice = voices.find(v => v.name === settings.voiceName) || voices.find(v => v.lang.startsWith('en-US')) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      setSelectedVoice(voice || null);
    }
  }, [settings.voiceName, voices]);

  const toggleListening = () => {
    if (!recognitionRef.current || isProcessing) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        recognitionRef.current.start();
      } catch (error: any) {
        console.error("Could not start recognition:", error);
        setVoiceError("Could not start voice recognition. Please try again.");
        setIsListening(false);
      }
    }
  };

  const stopSpeaking = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsSpeaking(false);
    setAvatarMood("neutral");
  };

  const clearConversation = () => {
    setConversation([]);
    stopSpeaking();
  };
  
  if (!isMounted) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-white">
           <div className="w-5 h-5 border-t-2 border-cyan-400 rounded-full animate-spin"></div>
           <span>Initializing Avatar...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
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
          setSettings={setSettings}
          voices={voices}
          selectedVoice={selectedVoice}
          setSelectedVoice={setSelectedVoice}
          closePanel={() => setShowSettingsPanel(false)}
        />
      )}
    </div>
  );
};

export default ConversationalAvatar;

