import Image from 'next/image'
import React from 'react'
import { buttonVariants } from './ui/button';
import { cn } from '@/lib/utils';

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
}



const Agent = ({userName}: AgentProps) => {
    const callStatus = CallStatus.FINISHED; // Replace with your actual call status
    const messages = [
        "whats your name?",
        "My name is Christino Ronald, nice to meet you!", ,
    ]; // Replace with your actual messages
    const lastMessage = messages[messages.length - 1]; // Get the last message
    const isSpeaking = true; // Replace with your actual speaking state

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
                <button className='relative btn-call'>

                    <span className={ cn("absoulte animate-ping rounded-full opacity-75", callStatus !== "CONNECTING" & "hidden") } />
                        <span>
                            {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Call" : " . . ." }
                        </span>

                </button>) : (
                    <button className="btn-disconnect">
                        End 
                    </button>

                )}

            </div>
    </>
    
  )
}

export default Agent