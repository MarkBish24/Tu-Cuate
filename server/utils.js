import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(file, language = "en") {
  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language,
  });
  return response.text;
}

export async function transcribeAudio(file, language = "es") {
  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language,
  });
  return response.text;
}

export async function createQuestion() {
  const prompt = `
    You are a spanish tutor
    `;
}

export async function gradeSpanishSentence(sentence) {
  const prompt = `
You are a Spanish grammar correction assistant.

I will provide a Spanish sentence that may contain mistakes. Respond only with a valid JSON object that follows this structure:

{
  "original_sentence": "<original input sentence>",
  "corrected_sentence": "<corrected version in Spanish>",
  "corrections": {
    "correction_1": "<explanation>",
    "correction_2": "<explanation>"
  }
}

Do not include any text outside of the JSON.

Here is the sentence: "${sentence}"
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  });
}
