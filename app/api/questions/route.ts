"use server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const SITE_NAME = "Learn2Code";

type messages = {
  role: string;
  content: string;
};

async function openRouterRequest(messages: messages[]) {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not defined in environment variables",
    );
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL, // Optional, for including your app on openrouter.ai rankings.
          "X-Title": SITE_NAME, // Optional. Shows in rankings on openrouter.ai.
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "arcee-ai/trinity-large-preview:free",
          messages: messages,
          temperature: 0.7,
          response_format: { type: "json_object" },
          provider: {
            ignore: ["False"], // Hints to use any available provider
          },
        }),
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        try {
          const errBody = await response.json();
          if (errBody.error?.message?.includes("data policy")) {
            throw new Error(
              "OpenRouter Privacy Settings Error: To use free models, you must enable 'Allow inputs and outputs to be stored' in your OpenRouter privacy settings (https://openrouter.ai/settings/privacy).",
            );
          }
        } catch (e) {
          /* ignore parse error */
        }
      }
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API Error: ${response.status} - ${errorText}`,
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Request Failed:", error);
    throw error;
  }
}

function cleanJson(text: string) {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    // Match first ```json or ``` ... and the ending ```
    const match = cleaned.match(/```(?:json)?([\s\S]*?)```/);
    if (match) {
      cleaned = match[1].trim();
    }
  }
  return cleaned;
}

export async function generateQuestionAction(
  topic: string,
  difficulty: string,
  language: string,
) {
  const prompt = `
    You are an expert technical interviewer. Create a coding interview question about "${topic}" in ${language}.
    Difficulty Level: ${difficulty}
    
    Return a JSON object with the following structure:
    {
      "title": "Short title of the problem",
      "description": "Detailed problem description including input/output examples",
      "requirements": ["List of 2-3 specific constraints or requirements"],
      "starterCode": "Initial code snippet for the user to start with (in ${language})"
    }
  `;

  try {
    const response = await openRouterRequest([
      {
        role: "system",
        content:
          "You are a helpful coding interview assistant. You always respond in valid JSON.",
      },
      { role: "user", content: prompt },
    ]);
    // Return the full AI response without parsing
    return { rawResponse: response };
  } catch (error) {
    console.error("Error generating question:", error);
    // Fallback mock response if API fails
    return {
      rawResponse: `(AI Generation Failed) Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function checkAnswerAction(
  question: string,
  code: string,
  language: string,
) {
  const prompt = `
    Review the following ${language} code for the problem: "${question}".
    
    User's Code:
    ${code}
    
    Analyze the correctness, efficiency, and style.
    Return a JSON object with the following structure:
    {
      "passed": boolean (true if logic is correct),
      "feedback": "Constructive feedback on what is good and what needs improvement",
      "suggestions": ["Specific suggestion 1", "Specific suggestion 2"]
    }
  `;

  try {
    const response = await openRouterRequest([
      {
        role: "system",
        content:
          "You are a helpful coding tutor. Be encouraging but strict on correctness. Resond in JSON.",
      },
      { role: "user", content: prompt },
    ]);
    return JSON.parse(cleanJson(response));
  } catch (error) {
    return {
      passed: false,
      feedback: "AI service unavailable. Please try again.",
      suggestions: ["Check your network connection"],
    };
  }
}

export async function getHintAction(
  question: string,
  code: string,
  context: string,
) {
  const prompt = `
      The user is solving: "${question}".
      Current code state:
      ${code}

      User asked: "${context}"

      Provide a helpful hint without giving away the full solution. Keep it brief.
       Return a JSON object:
      {
        "hint": "Your hint here"
      }
    `;

  try {
    const response = await openRouterRequest([
      { role: "system", content: "You are a helpful mentor. Respond in JSON." },
      { role: "user", content: prompt },
    ]);
    return JSON.parse(cleanJson(response));
  } catch (error) {
    return { hint: "Try breaking the problem down into smaller steps." };
  }
}
