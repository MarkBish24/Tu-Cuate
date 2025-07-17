const { OpenAI } = require("openai");
const path = require("path");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function transcribeAudio(file, language = "es") {
  const response = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
    language,
  });
  return response.text;
}

async function text2Speech(text, language = "es") {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = Buffer.from(await mp3.arrayBuffer());
    const filePath = path.join(__dirname, "data", "speech", "speech.mp3");

    fs.writeFileSync(filePath, buffer);

    return filePath;
  } catch (err) {
    console.error("TTS Error:", err);
    throw err;
  }
}

const systemPrompt = `You are a Spanish grammar assistant.

When I say "give me a question", I will give you topics.

You must:
- Create a natural, correct Spanish sentence using these topics.
- Translate it to English.
- Provide a word-by-word or phrase translation in this JSON format:

{
  "sentence_spanish": "<Spanish sentence>",
  "sentence_english": "<English translation>",
  "word_translation": [
    {"spanish": "<word or phrase>", "english": "<translation>"}
  ]
}

When I say "grade this response", I will give you a Spanish sentence with possible errors.

You must reply with a JSON array like this:

[
  {
    "original": "<original sentence>",
    "corrected": "<corrected Spanish>",
    "translation": "<English translation>",
    "mistakes": [
      {
        "type": "<error|inaccuracy|alternative>",
        "original": "<wrong part>",
        "correction": "<fix>",
        "explanation": "<why>"
      }
    ]
  }
]

Only return JSON. No extra text. Wait for my command before responding.

`;

let messages = [
  {
    role: "system",
    content: systemPrompt,
  },
];

function addUserMessage(content) {
  messages.push({
    role: "user",
    content,
  });
}

function addAssistantMessage(content) {
  messages.push({
    role: "assistant",
    content,
  });
}

// resets the messages prompt to just the main empty system prompt
// signifies starting a new converstation with new set data

function resetMessages() {
  messages = [{ role: "system", content: systemPrompt }];
}

// Helper function that returns a random spanish word from the list
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to get all active Spanish words from the data
function getActiveWords(data) {
  const activeWords = [];
  data.forEach((category) => {
    category.items.forEach((item) => {
      if (item.active === true) {
        activeWords.push(item.spanish);
      }
    });
  });
  return activeWords;
}

async function getTopics() {
  const dataDir = path.join(__dirname, "data");

  const adverbs = JSON.parse(
    fs.readFileSync(path.join(dataDir, "adverbs.json"), "utf-8")
  );
  const pronouns = JSON.parse(
    fs.readFileSync(path.join(dataDir, "pronouns.json"), "utf-8")
  );
  const tenses = JSON.parse(
    fs.readFileSync(path.join(dataDir, "tenses.json"), "utf-8")
  );
  const verbs = JSON.parse(
    fs.readFileSync(path.join(dataDir, "verbs.json"), "utf-8")
  );
  const vocab = JSON.parse(
    fs.readFileSync(path.join(dataDir, "vocab.json"), "utf-8")
  );

  const tempTopics = {
    adverbs: pickRandom(getActiveWords(adverbs)) || "",
    pronouns: pickRandom(getActiveWords(pronouns)) || "",
    tenses: pickRandom(getActiveWords(tenses)) || "",
    verbs: pickRandom(getActiveWords(verbs)) || "",
    vocab: pickRandom(getActiveWords(vocab)) || "",
    CEFR: "B1 CEFR LEVEL",
    length: "20 words Long",
  };

  return tempTopics;
}

async function generateResponse() {
  const topics = await getTopics();
  addUserMessage(`give me a question: ${JSON.stringify(topics)}`);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
  });

  const assistantReply = response.choices[0].message.content;
  addAssistantMessage(assistantReply);

  try {
    console.log("Generated Response Data", assistantReply);
    return JSON.parse(assistantReply);
  } catch {
    console.error("Failed to parse JSON");
    return null;
  }
}

async function gradeResponse(userReply) {
  addUserMessage(`grade this response: ${userReply}`);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
  });

  const assistantReply = response.choices[0].message.content;

  try {
    console.log("Graded Response Data", assistantReply);
    return JSON.parse(assistantReply);
  } catch {
    console.error("Failed to parse JSON");
    return null;
  } finally {
    resetMessages();
  }
}

module.exports = {
  transcribeAudio,
  text2Speech,
  generateResponse,
  gradeResponse,
  resetMessages,
};
