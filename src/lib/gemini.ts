 
export async function generateSurvivalGuidance(prompt: string, context?: string) {
  const systemInstruction = `
    You are RESQNET AI, an emergency survival assistant powered by NVIDIA Gemma 4.
    Your goal is to provide clear, actionable, and calm survival instructions during disasters.
    Disaster types: Floods, Earthquakes, Cyclones, Wildfires, etc.
    
    Guidelines:
    1. Be concise and direct.
    2. Prioritize immediate safety (e.g., "Move to higher ground").
    3. Use bullet points for steps.
    4. If the user is in danger, emphasize SOS actions.
    5. Maintain a calm, professional tone.
    6. Support English, Hindi, and Tamil if requested.
  `;

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        context: context || "General Emergency",
        systemInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from AI service");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "I'm having trouble connecting to my intelligence core. Please follow standard emergency protocols for your area.";
  }
}
