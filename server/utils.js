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
      voice: "shimmer",
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

const systemPrompt = `
You are a Spanish grammar assistant.

### PART 1: TRANSLATION TASK

When I say: **"give me a question"**, I will provide you with a **variety of topics** (e.g., objects, verbs, grammar tenses, or themes).

Your task is to:
- Create a **natural, grammatically correct Spanish sentence** that uses these topics.
- Translate the sentence into **English**.
- Break down the sentence into a **word-by-word (or phrase-by-phrase) translation** in valid JSON format.

Return only valid JSON using the following structure:

{
  "sentence_spanish": "<full Spanish sentence>",
  "sentence_english": "<full English translation>",
  "word_translation": [
    {
      "spanish": "<word or phrase in Spanish>",
      "english": "<matching English translation>"
    },
    ...
  ]
}

Notes:
- Group words logically where appropriate (e.g., "por favor" = "please").
- Do not include any explanation or commentary outside the JSON.

---

### PART 2: GRAMMAR GRADING TASK

When I say: **"grade this response"**, I will give you a Spanish sentence that may contain errors, inaccuracies, or awkward phrasing, that is responding to the previous question you gave.

You must respond with a valid JSON array using the following structure:

[
  {
    "original": "<original input sentence>",
    "corrected": "<corrected sentence in Spanish>",
    "translation": "<English translation of the corrected sentence>",
    "mistakes": [
      {
        "type": "<error | inaccuracy | alternative>",
        "original": "<original part with mistake>",
        "correction": "<corrected version>",
        "explanation": "<brief explanation of why the correction is appropriate>"
      }
    ]
  }
]

---

### IMPORTANT RULES:
- Only return valid JSON.
- Do NOT add explanations or text outside the JSON.
- Follow the structure **exactly**.
- Wait for my command ("give me a question" or "grade this response") before responding.
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
    model: "gpt-4",
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
    model: "gpt-4",
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
