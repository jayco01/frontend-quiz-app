import { GoogleGenerativeAI } from "@google/generative-ai";
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    return res.status(500).send("API Key not set in environment variables.");
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    const systemInstruction = {
      role: "system",
      parts: [{ text: `
        You are the "Quiz Helper Bot" for an interactive frontend quiz website.
        The quiz covers topics like HTML, CSS, JavaScript, and Accessibility.
        Your main goal is to assist users with questions specifically related to the quiz content.
        If a user asks a question unrelated to the quiz topics (HTML, CSS, JavaScript, Accessibility),
        politely state that you are here to help with the quiz and cannot answer unrelated questions.
        Keep your answers helpful, concise, and focused on the quiz material.
      `}]
    };

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
     });

    const { prompt, history } = req.body;

    if (!prompt) {
      return res.status(400).send("Missing 'prompt' in request body.");
    }

    const chat = model.startChat({
      history: history || [],
      generationConfig: {
        maxOutputTokens: 200,
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ text: text });

  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to get response from AI. Please try again.", details: error.message });
  }
}