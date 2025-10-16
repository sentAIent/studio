"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Message, AvatarMood, AvatarSettings } from "@/lib/types";
import { getAiResponse } from "@/app/actions";
import useLocalStorage from "@/hooks/use-local-storage";
import AvatarHeader from "./avatar-header";
import AvatarDisplay from "./avatar-display";
import ChatPanel from "./chat-panel";
import SettingsPanel from "./settings-panel";

const AvatarCore = () => {
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) return;
    
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      synth.cancel();
    }
    
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
      setTimeout(() => {
        if (typeof window !== 'undefined' && !window.speechSynthesis.speaking) {
           setAvatarMood("neutral");
        }
      }, 200);
    }
  }, [message, isProcessing, isListening, conversation, speak]);
  
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
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      console.log("Recognition started");
      setIsListening(true);
      setVoiceError('');
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      console.log("Recognition result:", finalTranscript);
      if (finalTranscript) {
        handleSendMessage(finalTranscript);
      }
    };
    
    recognition.onerror = (event) => {
      if (event.error === 'aborted') {
        console.log("Speech recognition gracefully aborted.");
        return;
      }
      let errorMsg = `An error occurred with speech recognition: ${event.error}.`;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings and try again.";
      } else if (event.error === 'no-speech') {
        errorMsg = "No speech was detected. Please make sure your microphone is working and try again.";
      } else if (event.error === 'network') {
        errorMsg = "A network error occurred with the speech recognition service. Please check your internet connection.";
      } else if (event.error === 'audio-capture') {
        errorMsg = "Audio capture failed. Your microphone might be in use by another application or not connected properly.";
      }
      setVoiceError(errorMsg);
      console.error("Speech recognition error:", event.error, event.message);
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        console.log("Cleaning up recognition");
        recognitionRef.current.abort();
      }
    };
  }, [handleSendMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);
  
  useEffect(() => {
    const loadVoices = () => {
      if(typeof window === 'undefined' || !window.speechSynthesis) return;
      const availableVoices = window.speechSynthesis.getVoices();
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
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [settings.voiceName]);

  const toggleListening = () => {
    console.log("Toggling listening. Current state:", isListening);
    if (isProcessing || !recognitionRef.current) {
        console.log("Cannot toggle listening. isProcessing:", isProcessing, "recognitionRef:", !recognitionRef.current);
        return;
    };

    if (isListening) {
      console.log("Stopping recognition");
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        console.log("Starting recognition");
        recognitionRef.current.start();
      } catch (error: any) {
        console.error("Could not start recognition:", error);
        if (error.name === 'InvalidStateError') {
             setVoiceError("Could not start voice recognition. It might already be running. Please try again.");
        } else {
            setVoiceError("Could not start voice recognition. Please ensure your browser has microphone permissions enabled.");
        }
        setIsListening(false);
      }
    }
  };
  
  const stopSpeaking = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setAvatarMood("neutral");
  };

  const clearConversation = () => {
    setConversation([]);
    stopSpeaking();
  };

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

export default AvatarCore;
