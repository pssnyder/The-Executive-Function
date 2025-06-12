
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME } from '../constants';
import { ParsedTaskData, TaskPriority } from '../types';

// Ensure process.env.API_KEY is handled by the build/runtime environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY environment variable not set. Gemini API calls will fail.");
  // Potentially throw an error or have a fallback, depending on desired app behavior
}
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_API_KEY" });

export const parseNaturalLanguageTask = async (text: string): Promise<ParsedTaskData | null> => {
  if (!apiKey) {
    console.error("Cannot parse task with AI: API_KEY is not configured.");
    // Simulate parsing for development if API key is missing
    return { 
        title: `Mock Parsed: ${text.substring(0,30)}`, 
        description: "Mock description as API key is missing.",
        priority: TaskPriority.MEDIUM, 
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
        category: "General (Mock)"
    };
  }
  
  const prompt = `
    Parse the following user input to extract task details.
    The user input is: "${text}"

    Extract the following information:
    1.  title (string): A concise title for the task.
    2.  description (string, optional): A more detailed description if available. If not, use the title or a summary.
    3.  priority (enum: 'low', 'medium', 'high', 'urgent', optional): The priority of the task. Default to 'medium' if not specified.
    4.  dueDate (string, optional): The due date in YYYY-MM-DD format. If a relative date like "tomorrow" or "next Friday" is given, calculate it based on today being ${new Date().toISOString().split('T')[0]}.
    5.  category (string, optional): A suggested category like 'Work', 'Personal', 'Errands', 'Meeting'. Default to 'General' if not inferable.

    Respond STRICTLY with a JSON object matching this structure:
    {
      "title": "...",
      "description": "...",
      "priority": "...",
      "dueDate": "...",
      "category": "..."
    }
    Ensure the dueDate is correctly formatted as YYYY-MM-DD.
    If a field cannot be determined, it can be omitted or set to a default value as specified.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    let jsonStr = response.text.trim();
    // Remove Markdown fences if present
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as ParsedTaskData;

    // Validate and normalize priority
    if (parsedData.priority && !Object.values(TaskPriority).includes(parsedData.priority as TaskPriority)) {
        parsedData.priority = TaskPriority.MEDIUM;
    }


    return parsedData;

  } catch (error) {
    console.error("Error parsing task with AI:", error);
    // Fallback or re-throw, depending on how you want to handle errors.
    // For now, return a basic structure indicating failure or partial success.
     return { 
        title: `Error Parsing: ${text.substring(0,30)}`, 
        description: "Could not parse details with AI.",
        priority: TaskPriority.MEDIUM, 
        category: "Uncategorized"
    };
  }
};
