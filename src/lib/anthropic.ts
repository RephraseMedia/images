import Anthropic from '@anthropic-ai/sdk';
import { AnthropicError } from './errors';
import type { PresentationData, PresentationStyle } from '@/types/presentation';

let anthropicClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (!anthropicClient) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new AnthropicError('ANTHROPIC_API_KEY is not configured');
    }
    anthropicClient = new Anthropic({ apiKey });
  }
  return anthropicClient;
}

const STYLE_GUIDANCE: Record<PresentationStyle, string> = {
  professional: 'Use a formal, corporate tone. Focus on clarity and data-driven points. Keep language concise and business-appropriate.',
  creative: 'Use an engaging, imaginative tone. Include vivid descriptions and creative angles. Make the content visually expressive.',
  minimal: 'Use a clean, concise tone. Keep bullet points short and impactful. Less is more — focus on key takeaways.',
  bold: 'Use a strong, confident tone. Make statements impactful and direct. Use powerful language that commands attention.',
  academic: 'Use a scholarly, structured tone. Include evidence-based points and logical flow. Maintain formal academic language.',
};

export async function generatePresentationContent(
  topic: string,
  slideCount: number,
  style: PresentationStyle
): Promise<PresentationData> {
  try {
    const client = getClient();

    const systemPrompt = `You are a presentation content generator. You MUST respond with valid JSON only — no markdown, no explanation, no code fences. Generate structured slide content for presentations.

The JSON must follow this exact structure:
{
  "title": "Presentation Title",
  "subtitle": "A brief subtitle",
  "slides": [
    {
      "slideNumber": 1,
      "title": "Slide Title",
      "bullets": ["Point 1", "Point 2", "Point 3"],
      "speakerNotes": "Notes for the presenter",
      "layout": "title"
    }
  ]
}

Layout rules:
- Slide 1 must have layout "title"
- The last slide must have layout "conclusion"
- Use layout "section" for transition slides that introduce new topics (use 1-2 of these)
- All other slides should have layout "content"

Each content slide should have 3-5 bullet points. Speaker notes should be 1-2 sentences.`;

    const userPrompt = `Create a ${slideCount}-slide presentation about: "${topic}"

Style: ${style}
${STYLE_GUIDANCE[style]}

Return ONLY the JSON object, nothing else.`;

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      system: systemPrompt,
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    if (!textBlock || textBlock.type !== 'text') {
      throw new AnthropicError('No text response from Anthropic');
    }

    let jsonText = textBlock.text.trim();

    // Strip markdown code fences if present
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
    }

    const parsed = JSON.parse(jsonText) as PresentationData;

    // Validate structure
    if (!parsed.title || !parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new AnthropicError('Invalid presentation structure returned');
    }

    return parsed;
  } catch (error) {
    if (error instanceof AnthropicError) throw error;
    const message = error instanceof Error ? error.message : 'Unknown Anthropic error';
    throw new AnthropicError(message);
  }
}
