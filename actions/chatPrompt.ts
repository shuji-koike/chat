"use server"

import OpenAI from "openai"
import {
  ResponseInput,
  ResponseCreateParamsNonStreaming,
} from "openai/resources/responses/responses.js"
import { stream } from "./fetchData"
import { instructions } from "./prompt"

export async function streamChatInterviewAction() {
  return stream(chatInterviewAction())
}

export async function* chatInterviewAction() {
  for await (const event of chatInterviewPrompt({
    input: [{ role: "user", content: "ヒアリングを開始" }],
  })) {
    switch (event.type) {
      case "response.output_text.delta":
        yield event.delta
        break
      case "response.completed":
        for (const output of event.response.output) {
          if (output.type !== "message") continue
        }
        console.info(event.response.usage)
        break
      case "response.reasoning_summary_text.done":
        console.debug(event.text)
        break
    }
  }
  return ""
}

export async function* chatInterviewPrompt({
  input,
  params,
}: {
  input: ResponseInput
  params?: Partial<ResponseCreateParamsNonStreaming>
}) {
  console.info(chatInterviewPrompt.name, input.length)
  const stream = await new OpenAI().responses.create({
    model: "gpt-4.1",
    // temperature: 0.4,
    service_tier: "priority",
    ...params,
    store: true,
    stream: true,
    instructions,
    input,
  })
  for await (const event of stream) yield event
}
