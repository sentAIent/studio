
"use client";

import React from "react";
import { Mic, Send, Zap } from "lucide-react";
import type { Message } from "@/lib/types";
import { cn } from "@/lib/utils";

type ChatPanelProps = {
  conversation: Message[];
  isProcessing: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: (message?: string) => void;
  isListening: boolean;
  toggleListening: () => void;
  speechRecognitionAvailable: boolean;
  clearConversation: () => void;
  voiceError: string;
  setVoiceError: (error: string) => void;
};

const ChatPanel = ({
  conversation,
  isProcessing,
  messagesEndRef,
  message,
  setMessage,
  handleSendMessage,
  isListening,
  toggleListening,
  speechRecognitionAvailable,
  clearConversation,
  voiceError,
  setVoiceError,
}: ChatPanelProps) => {
  return (
    <div className="w-full md:w-96 bg-black/50 backdrop-blur-md border-t md:border-t-0 md:border-l border-cyan-400/30 flex flex-col shadow-2xl shadow-cyan-500/10 md:max-h-full flex-1">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
        {conversation.length === 0 && (
          <div className="text-center text-cyan-300 mt-8 px-4">
            <Zap className="w-12 h-12 mx-auto mb-4 text-cyan-400 animate-pulse" />
            <p className="text-lg font-medium mb-2">Start a conversation</p>
            <p className="text-sm opacity-75">
              Type a message or use voice input
            </p>
            <div className="mt-6 space-y-2 text-xs opacity-60">
              <p>💡 Ask me anything</p>
              <p>🎙️ Use voice for natural conversation</p>
              <p>⚙️ Customize in settings</p>
            </div>
          </div>
        )}
        {conversation.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            } animate-fadeIn`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2 shadow-lg ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-cyan-500/30"
                  : "bg-gradient-to-br from-slate-800 to-slate-700 text-gray-100 shadow-slate-900/50 border border-cyan-400/10"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start animate-fadeIn">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl px-4 py-3 border border-cyan-400/10">
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-cyan-400/30 bg-gradient-to-b from-transparent to-black/20">
        {voiceError && (
          <div className="mb-3 bg-rose-500/20 border border-rose-400/40 rounded-xl p-3 text-rose-300 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg pt-0.5">⚠️</span>
              <div className="flex-1">
                <p className="font-medium mb-1">Voice Input Issue</p>
                <p className="text-xs opacity-90">{voiceError}</p>
                <button
                  onClick={() => setVoiceError("")}
                  className="text-xs underline mt-2 hover:text-rose-200"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !isProcessing && handleSendMessage()}
            placeholder="Type your message..."
            disabled={isProcessing}
            className="flex-1 bg-slate-800/80 border border-cyan-400/30 rounded-xl px-4 py-2 text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/20 transition-all duration-300 disabled:opacity-50"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !message.trim()}
            className="bg-gradient-to-br from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-white p-2 rounded-xl transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={toggleListening}
            disabled={isProcessing || !speechRecognitionAvailable}
            title={
              !speechRecognitionAvailable
                ? "Voice input not supported on this browser"
                : "Click to use voice input"
            }
            className={cn(
              "flex-1 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed",
              isListening
                ? "bg-gradient-to-r from-rose-500 to-pink-600 shadow-xl shadow-rose-500/40"
                : speechRecognitionAvailable
                ? "bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/30 shadow-lg shadow-cyan-500/20"
                : "bg-slate-700/30 border border-slate-600/30 cursor-not-allowed"
            )}
          >
            {isListening ? (
              <>
                <Mic className="w-5 h-5" />
                <span className="text-sm font-bold">Listening...</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span className="text-sm">
                  {speechRecognitionAvailable
                    ? "Voice Input"
                    : "Voice Not Available"}
                </span>
              </>
            )}
          </button>
          {conversation.length > 0 && (
            <button
              onClick={clearConversation}
              className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-cyan-300 rounded-xl transition-all duration-300 text-sm font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
