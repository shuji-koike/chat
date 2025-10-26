"use client"

import { useState } from "react"
import { IteratorResponse } from "../actions/fetchData"
import { streamChatInterviewAction } from "../actions/chatPrompt"

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
