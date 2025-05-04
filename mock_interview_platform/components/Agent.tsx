"use client"

import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { set } from 'zod';
import { vapi } from '@/lib/vapi.sdk';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}

interface SavedMessage{
    role: "user" | "system" | "assistant";
    content: string;
}


const Agent = ({userName, userId, type}: AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE); // Initialize call status
    const [messages, setMessages] = useState<SavedMessage[]>([]); // Initialize messages
    const [lastMessage, setLastMessage] = useState<string>(""); // Initialize last message

    useEffect(() => {
        const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
        const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

        const onMessage =(message:Message) => {
            if(message.type === "transcript" && message.transcriptType === "final") {
                const newMessage = {role :message.role, content :message.transcript }
                setMessages((prev) => [...prev, newMessage]);

            }
        }
        const onSpeechStart = () => setIsSpeaking(true);
        const onSpeechEnd = () => setIsSpeaking(false);

        const onErrror = (error: Error) => console.error("Error:", error);

        vapi.on("call-start", onCallStart);
        vapi.on("call-end", onCallEnd);
        vapi.on("message", onMessage);
        vapi.on("speech-start", onSpeechStart);
        vapi.on("speech-end", onSpeechEnd);
        vapi.on("error", onErrror);

        return () => {
            vapi.off("call-start", onCallStart);
            vapi.off("call-end", onCallEnd);
            vapi.off("message", onMessage);
            vapi.off("speech-start", onSpeechStart);
            vapi.off("speech-end", onSpeechEnd);
            vapi.off("error", onErrror);
        }
    },[])

    useEffect(() => {
        if(callStatus === CallStatus.FINISHED) router.push("/");

    },[messages, callStatus, type, userId])

    const handleCall = async () => {
        setCallStatus(CallStatus.CONNECTING);

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
            variableValues: {
                username: userName,
                userid: userId,

            }
        }) 
    }

    const handleDisconnect = async () => {
        setCallStatus(CallStatus.FINISHED);
            vapi.stop();
    }

    const latestMessage = messages[messages.length - 1]?.content; // Get the last message
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED; // Check if the call is inactive or finished

    
  return (
    <>
        <div className='call-view'>
            <div className='card-interviewer'>
                <div className='avatar'>
                    
                    <Image src = "/ai-avatar.png" alt = "vapi" width={65} height={54} className='object-cover'/>
                    {isSpeaking && <span className='animate-speak'></span>}
                    
                </div>
                <h3>
                    AI Interview
                </h3>
            </div>
            <div className='card-boder'>
                <div className='card-content'>
                    <Image src="/user-avatar.png" alt="user" width={540} height={540} className='rounded-full object-cover size-[120px]'/>
                    <h3>{userName}</h3>
                </div>
            </div>
        </div>

        {messages.length > 0 && (
            <div className='transcript-border'>
                <div className='transcript'>
                    <p key={lastMessage} className={ cn("transition-opacity duration-500 opacity-0", "animate-fadeIn opacity-100")}>
                        {lastMessage}
                    </p>   
                </div>
            </div>
        )}

            <div className='w-full flex justify-center'>
                {callStatus !== "ACTIVE" ? (
                <button className='relative btn-call' onClick={handleCall}>

                    <span className={ cn("absoulte animate-ping rounded-full opacity-75", callStatus !== "CONNECTING" && "hidden") } />
                        <span>
                            {isCallInactiveOrFinished ? "Call" : " . . ." }
                        </span>

                </button>) : (
                    <button className="btn-disconnect" onClick={handleDisconnect}>
                        End 
                    </button>

                )}

            </div>
    </>
    
  )
}

export default Agent