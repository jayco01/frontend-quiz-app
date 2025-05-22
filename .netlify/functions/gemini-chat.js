const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: "Method Not Allowed"
        };
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return {
            statusCode: 500,
            body: "API Key not set in environment variables."
        };
    }

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

        const { prompt, history } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: "Missing 'prompt' in request body."
            };
        }

        // Build the chat history
        const chat = model.startChat({
            history: history || [], // Initialize with empty array if no history
            generationConfig: {
                maxOutputTokens: 200, // Limit AI response length for quicker, more focused answers
            },
        });

        const result = await chat.sendMessage(prompt);
        const response = await result.response;
        const text = response.text();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: text })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to get response from AI. Please try again.", details: error.message })
        };
    }
};