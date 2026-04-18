const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

export const sendMessageToAI = async (messages, recipeContext) => {
  const systemPrompt = `You are SmartChef AI, a friendly and intelligent cooking assistant — like an experienced home chef or a caring mother guiding someone in the kitchen.

CURRENT COOKING CONTEXT:
- Recipe: ${recipeContext?.name || "Unknown"}
- Current Step: ${recipeContext?.currentStep || "Not started"}
- Ingredients: ${recipeContext?.ingredients?.join(", ") || "Not specified"}

YOUR RESPONSIBILITIES:
1. Guide the user step-by-step through cooking clearly and simply
2. Help when stuck — give quick practical solutions
3. Suggest ingredient substitutes if something is missing
4. Give cooking tips to improve taste, texture, and presentation
5. Warn about safety (hot oil, raw meat, etc.)

RESPONSE STYLE:
- Warm, friendly and encouraging 😊
- Simple language — no technical jargon
- Short replies — max 80-100 words
- Use emojis occasionally to feel human
- Give actionable steps, not long explanations

STRICT RULES:
- Only answer cooking-related questions
- If asked something unrelated, politely redirect to cooking
- Never give harmful advice
- Always prioritize user safety`;

  try {
    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        max_tokens: 200,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err?.error?.message || "Groq API failed");
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't respond. Try again!";

  } catch (error) {
    console.error("AI Error:", error.message);
    const q = (messages[messages.length - 1]?.content || "").toLowerCase();
    if (q.includes("burn") || q.includes("burning"))
      return "🔥 Lower the flame immediately! Move the pan off heat for 30 seconds, then continue on low. Add a splash of water if needed.";
    if (q.includes("next") || q.includes("what to do"))
      return `👩🍳 Your current step is: "${recipeContext?.currentStep}". Follow it carefully — you're doing great!`;
    if (q.includes("substitute") || q.includes("don't have") || q.includes("missing"))
      return "💡 Tell me which ingredient you're missing and I'll suggest the best substitute right away!";
    if (q.includes("how long") || q.includes("time"))
      return "⏱️ Watch for visual cues — color change and aroma are your best guides. Usually 3-5 minutes per step.";
    return "👩🍳 I'm here to help! Ask me about the current step, substitutes, or anything about your cooking!";
  }
};
