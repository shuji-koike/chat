"use client"

import { useState } from "react"
import { IteratorResponse } from "../actions/fetchData"
import { streamChatInterviewAction } from "../actions/chatPrompt"
import { useChat } from "@ai-sdk/react"

export function MyClientComponent() {
  const [data, setData] = useState<string[]>([])
  return (
    <div className="flex flex-col gap-4 ">
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={async () => {
          setData([])
          for await (const value of genStream(
            await streamChatInterviewAction(),
          )) {
            setData((prev) => prev.concat(value))
          }
        }}
      >
        stream data
      </button>
      <p>{data.join("")}</p>
      <Chat />
    </div>
  )
}

async function* genStream<T, U>(res: IteratorResponse<T, U>) {
  while (true) {
    yield res.result.value
    if (!res.next) break
    res = await res.next
  }
}

export default function Chat() {
  const [input, setInput] = useState("")
  const { messages, sendMessage } = useChat()
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === "user" ? "User: " : "AI: "}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return <div key={`${message.id}-${i}`}>{part.text}</div>
            }
          })}
        </div>
      ))}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  )
}
