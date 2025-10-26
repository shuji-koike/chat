import { openai } from "@ai-sdk/openai"
import { streamText, UIMessage, convertToModelMessages } from "ai"
import { instructions } from "../../../actions/prompt"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: openai("gpt-4.1"),
    messages: convertToModelMessages([
      {
        role: "system",
        parts: [{ type: "text", text: instructions }],
      },
      ...messages,
    ]),
  })

  return result.toUIMessageStreamResponse()
}
