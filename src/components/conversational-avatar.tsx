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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation, isProcessing]);
  
  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
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

    synthRef.current.speak(utterance);
  }, [selectedVoice, settings.speechRate, settings.volume]);

  useEffect(() => {
    synthRef.current = window.speechSynthesis;

    const loadVoices = () => {
      if(!synthRef.current) return;
      const availableVoices = synthRef.current.getVoices();
      setVoices(availableVoices);
      
      if (availableVoices.length > 0) {
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
      }
    };

    loadVoices();
    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    const hasSpeechRecognition = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechRecognitionAvailable(hasSpeechRecognition);

    if (hasSpeechRecognition) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceError('');
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error, event.message);
        setIsListening(false);
        let errorMsg = `An error occurred: ${event.error}.`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          errorMsg = "Microphone access denied. Please allow microphone permissions in your browser settings and try again.";
        } else if (event.error === 'no-speech') {
          errorMsg = "No speech detected. Please make sure your microphone is working and try again.";
        } else if (event.error === 'network') {
          errorMsg = "Network error. Please check your internet connection and try again.";
        } else if (event.error === 'audio-capture') {
          errorMsg = "Audio capture error. Your microphone might be in use by another application.";
        }
        setVoiceError(errorMsg);
      };
    }

    return () => {
      recognitionRef.current?.stop();
      synthRef.current?.cancel();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (voices.length > 0) {
      const voice = voices.find(v => v.name === settings.voiceName);
      setSelectedVoice(voice || voices[0]);
    }
  }, [settings.voiceName, voices]);


  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    // Stop listening if we were
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const userMessage: Message = { role: "user", content: textToSend };
    setConversation((prev) => [...prev, userMessage]);
    setMessage("");
    setAvatarMood("thinking");
    setIsProcessing(true);

    try {
      const aiResponse = await getAiResponse([...conversation, userMessage], textToSend);
      
      const assistantMessage: Message = { role: "assistant", content: aiResponse };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(aiResponse);
    } catch(e) {
      console.error(e);
      const assistantMessage: Message = { role: "assistant", content: "Sorry, I had trouble generating a response." };
      setConversation((prev) => [...prev, assistantMessage]);
      speak(assistantMessage.content);
    } finally {
      setIsProcessing(false);
      setAvatarMood("neutral");
    }
  };

  const toggleListening = () => {
    if (!speechRecognitionAvailable || !recognitionRef.current) {
      setVoiceError("Voice recognition is not supported by your browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        setVoiceError('');
        recognitionRef.current.start();
      } catch (error) {
        console.error("Could not start recognition:", error);
        setVoiceError("Could not start voice recognition. Please check browser permissions.");
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
          handleSendMessage={handleSendMessage}
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
