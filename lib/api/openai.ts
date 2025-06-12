import OpenAI from 'openai';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key');
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function generateText(prompt: string) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4',
    });

    return completion.choices[0]?.message?.content;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate text');
  }
}

export async function generateImage(prompt: string) {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    if (!response.data || response.data.length === 0) {
      throw new Error('No image generated');
    }

    return response.data[0].url;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate image');
  }
}

export default openai;
