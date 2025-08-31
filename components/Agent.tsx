'use client'
import Image from "next/image"
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Mic, MicOff, Phone, PhoneOff, Loader2, Bot, User, Waves } from "lucide-react";

enum CallStatus {
    INACTIVE = 'INACTIVE',
    CONNECTING = 'CONNECTING',
    ACTIVE = 'ACTIVE',
    FINISHED = 'FINISHED'
}

interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName, userId, type, interviewId, feedbackId, questions }: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
        if(message.type === 'transcript' && message.transcriptType === 'final'){
            const newMessage = { role: message.role, content: message.transcript };
            setMessages((prev) => [...prev, newMessage]);
        }
    }
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log('Error', error);

    vapi.on('call-start', onCallStart);
    vapi.on('call-end', onCallEnd);
    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('error', onError);

    return () => {
        vapi.off('call-start', onCallStart);
        vapi.off('call-end', onCallEnd);
        vapi.off('message', onMessage);
        vapi.off('speech-start', onSpeechStart);
        vapi.off('speech-end', onSpeechEnd);
        vapi.off('error', onError);
    }
  }, [])  

  useEffect(() => {
    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("Generate feedback here");
      const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages
      })
      if(success && id){
          router.push(`/interview/${interviewId}/feedback`);
      } else {
          console.log("Error saving feedback");
          router.push("/");
      }
    }
    if(callStatus === CallStatus.FINISHED){
        if(type === "generate"){
            router.push("/");
        } else{
            handleGenerateFeedback(messages);
        }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId])

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    if (type === "generate") {
      await vapi.start(
        undefined,
        undefined,
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,
        {
          variableValues: {
            username: userName,
            userid: userId,
          },
        }
      );
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-indigo-500 opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-500 opacity-10 blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
            <Waves className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            AI Interview Session
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Practice with our AI interviewer and receive instant feedback on your performance.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* AI Interviewer Card */}
          <div className="bg-white dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                  <div className="relative">
                    <Image 
                        src="/ai-avatar.png" 
                        alt="AI Interviewer" 
                        width={150} 
                        height={150} 
                        className="rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl" 
                    />
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 animate-ping opacity-20"></div>
                    {isSpeaking && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-indigo-500 rounded-full p-3 shadow-lg">
                        <Mic className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">AI Interviewer</h2>
                <div className="flex items-center text-slate-500 dark:text-slate-400 mb-6">
                  <div className={`w-3 h-3 rounded-full mr-2 ${callStatus === CallStatus.ACTIVE ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                  <span className="font-medium">
                    {callStatus === CallStatus.ACTIVE ? 'Listening' : callStatus === CallStatus.CONNECTING ? 'Connecting...' : 'Ready'}
                  </span>
                </div>
                
                {/* Status bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2 mb-4">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                      callStatus === CallStatus.ACTIVE ? 'w-4/5' : 
                      callStatus === CallStatus.CONNECTING ? 'w-1/2' : 'w-0'
                    }`}
                  ></div>
                </div>
                
                <div className="flex justify-center space-x-2 mt-2">
                  <div className={`h-2 w-2 rounded-full ${
                    callStatus === CallStatus.INACTIVE ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}></div>
                  <div className={`h-2 w-2 rounded-full ${
                    callStatus === CallStatus.CONNECTING ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}></div>
                  <div className={`h-2 w-2 rounded-full ${
                    callStatus === CallStatus.ACTIVE ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}></div>
                  <div className={`h-2 w-2 rounded-full ${
                    callStatus === CallStatus.FINISHED ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-600'
                  }`}></div>
                </div>
              </div>
            </div>
          </div>

          {/* User Card */}
          <div className="bg-white dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md opacity-20"></div>
                  <div className="relative">
                    <Image 
                        src="/user-avatar.png" 
                        alt="User" 
                        width={150} 
                        height={150} 
                        className="rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-xl" 
                    />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{userName}</h2>
                <div className="text-slate-500 dark:text-slate-400 mb-6">Candidate</div>
                
                {/* Status bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-2 mb-4">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ${
                      callStatus === CallStatus.ACTIVE ? 'w-3/5' : 'w-0'
                    }`}
                  ></div>
                </div>
                
                <div className="text-center text-slate-500 dark:text-slate-400 text-sm mt-4">
                  {callStatus === CallStatus.ACTIVE ? 'Interview in progress' : 'Ready to start'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Section */}
        {messages.length > 0 && (
          <div className="mb-16">
            <div className="bg-white dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Conversation</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {messages.length} messages
                  </div>
                </div>
              </div>
              <div className="p-6 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-5 ${
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none' 
                          : 'bg-slate-100 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-none'
                      }`}>
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            message.role === 'user' 
                              ? 'bg-white/20' 
                              : 'bg-slate-200 dark:bg-slate-600'
                          }`}>
                            {message.role === 'user' ? (
                              <User className="h-4 w-4 text-white" />
                            ) : (
                              <Bot className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium mb-1">
                              {message.role === 'user' ? 'You' : 'AI Interviewer'}
                            </p>
                            <p>{message.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call Controls */}
        <div className="flex justify-center mb-10">
          {callStatus !== CallStatus.ACTIVE ? (
            <button
              onClick={handleCall}
              disabled={callStatus === CallStatus.CONNECTING}
              className={cn(
                "relative flex items-center justify-center px-12 py-6 rounded-full text-xl font-bold text-white shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 overflow-hidden group",
                callStatus === CallStatus.CONNECTING 
                  ? "bg-gradient-to-r from-indigo-400 to-purple-400 cursor-not-allowed" 
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              )}
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {callStatus === CallStatus.CONNECTING ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin relative z-10" />
                  <span className="relative z-10">Connecting...</span>
                </>
              ) : (
                <>
                  <Phone className="mr-3 h-6 w-6 relative z-10" />
                  <span className="relative z-10">Start Interview</span>
                </>
              )}
              {callStatus === CallStatus.CONNECTING && (
                <span className="absolute inset-0 rounded-full bg-indigo-400 opacity-20 animate-pulse"></span>
              )}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="flex items-center justify-center px-12 py-6 rounded-full text-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 group"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <PhoneOff className="mr-3 h-6 w-6 relative z-10" />
              <span className="relative z-10">End Interview</span>
            </button>
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex justify-center">
          <div className="inline-flex items-center px-6 py-3 rounded-full text-base font-medium bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-lg">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              callStatus === CallStatus.INACTIVE ? 'bg-slate-400' :
              callStatus === CallStatus.CONNECTING ? 'bg-yellow-500 animate-pulse' :
              callStatus === CallStatus.ACTIVE ? 'bg-green-500' : 'bg-blue-500'
            }`}></div>
            <span className="font-semibold">
              Status: {
                callStatus === CallStatus.INACTIVE ? 'Ready to start' :
                callStatus === CallStatus.CONNECTING ? 'Connecting to AI' :
                callStatus === CallStatus.ACTIVE ? 'Interview in progress' : 'Interview completed'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agent