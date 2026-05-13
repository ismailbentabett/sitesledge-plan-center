import { getOpenAI, isAIEnabled } from './openai'

const DEFAULT_MODEL = 'gpt-4o-mini'
const STREAM_MODEL = 'gpt-4o-mini'

interface CompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

interface JSONCompletionOptions extends CompletionOptions {
  strict?: boolean
}

type ParsedJSONResult<T> = {
  success: true
  data: T
} | {
  success: false
  error: string
  raw: string
}

export async function generateCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: CompletionOptions = {}
): Promise<string | null> {
  if (!isAIEnabled()) return null

  const openai = getOpenAI()
  if (!openai) return null

  try {
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    return response.choices[0]?.message?.content ?? null
  } catch (err) {
    console.error('OpenAI completion error:', err)
    return null
  }
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  options: JSONCompletionOptions = {}
): Promise<ParsedJSONResult<T> | null> {
  if (!isAIEnabled()) return null

  const openai = getOpenAI()
  if (!openai) return null

  const fullSystemPrompt = `${systemPrompt}\n\nYou must respond with valid JSON only. No markdown, no explanations, just the JSON object.`

  try {
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      temperature: options.temperature ?? 0.1,
      max_tokens: options.maxTokens ?? 2000,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: fullSystemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const content = response.choices[0]?.message?.content
    if (!content) return null

    try {
      const parsed = JSON.parse(content) as T
      return { success: true, data: parsed }
    } catch {
      return { success: false, error: 'Failed to parse AI response as JSON', raw: content }
    }
  } catch (err) {
    console.error('OpenAI JSON completion error:', err)
    return null
  }
}

export async function withFallback<T>(
  promise: Promise<T | null>,
  fallbackValue: T
): Promise<T> {
  try {
    const result = await promise
    return result ?? fallbackValue
  } catch {
    return fallbackValue
  }
}

export interface AIStreamChunk {
  content: string
  done: boolean
}

export async function* streamCompletion(
  systemPrompt: string,
  userPrompt: string,
  options: CompletionOptions = {}
): AsyncGenerator<AIStreamChunk> {
  if (!isAIEnabled()) {
    yield { content: '', done: true }
    return
  }

  const openai = getOpenAI()
  if (!openai) {
    yield { content: '', done: true }
    return
  }

  try {
    const stream = await openai.chat.completions.create({
      model: options.model || STREAM_MODEL,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 1000,
      stream: true,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    let fullContent = ''
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content
      if (delta) {
        fullContent += delta
        yield { content: fullContent, done: false }
      }
    }

    yield { content: fullContent, done: true }
  } catch (err) {
    console.error('OpenAI stream error:', err)
    yield { content: '', done: true }
  }
}

export { DEFAULT_MODEL }
