const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Streams a chat completion from OpenAI.
 * @param {Object} params
 * @param {Array} params.messages - Message history array
 * @param {Function} params.onToken - Called with each streamed token
 * @param {Function} params.onComplete - Called with the full response when done
 */
async function streamChatCompletion({ messages, onToken, onComplete }) {
  const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages,
    stream: true,
    max_tokens: 2048,
    temperature: 0.7,
  });

  let fullResponse = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullResponse += delta;
      onToken(delta);
    }
  }

  await onComplete(fullResponse);
}

module.exports = { streamChatCompletion };
