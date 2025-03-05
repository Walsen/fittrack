import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are a helpful workout assistant. Provide advice on exercises, form, nutrition, and fitness goals. Keep responses concise and actionable.",
  })

  return result.toDataStreamResponse()
}

