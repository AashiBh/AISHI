
import { GoogleGenAI, Type } from "@google/genai";
import { HeartFeatures, PredictionResult } from "../types";

export const analyzeHeartHealth = async (features: HeartFeatures): Promise<PredictionResult> => {
  // Initialize AI with the environment variable provided by the system/Vite
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const systemInstruction = `
    You are a specialized Medical Data Analytics Engine mirroring an "Orange Data Mining" environment using the UCI Heart Disease dataset.
    
    ORANGE/UCI THRESHOLD LOGIC:
    - CA (Major Vessels): 0 is standard. Values >= 1 are strong "High Risk" indicators.
    - OLDPEAK (ST depression): <= 1.0 is considered low risk. > 1.0 is an "Orange Alert" parameter for pathology.
    - THAL (Thalassemia): 3 is normal. 6 (fixed) and 7 (reversible) are high-impact risk indicators.
    - CP (Chest Pain): 4 (Asymptomatic) often yields the highest disease probability in the dataset.
    - SEX: 1 (Male) statistically correlates to higher risk in this specific dataset.

    Your output must strictly follow the provided JSON schema. Classify the user as High, Medium, or Low risk based on these specific numerical thresholds.
  `;

  const prompt = `Perform a dataset-driven analysis for the following patient parameters:
    Age: ${features.age}, Sex: ${features.sex === 1 ? 'Male' : 'Female'}, Chest Pain Type: ${features.cp}, 
    Resting BP: ${features.bp}, Cholesterol: ${features.chol}, Max Heart Rate: ${features.maxhr}, 
    Exercise Induced Angina: ${features.exang === 1 ? 'Yes' : 'No'}, ST Depression (Oldpeak): ${features.oldpeak}, 
    Number of Major Vessels (CA): ${features.ca}, Thalassemia (Thal): ${features.thal}
    
    Explain how CA, Thal, and Oldpeak markers influence the "Orange Database" risk prediction.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          prediction: { type: Type.STRING },
          risk_level: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          risk_score: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
          clinical_analysis: { type: Type.STRING },
          orange_database_logic: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          feature_importance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                impact: { type: Type.NUMBER },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ['prediction', 'risk_level', 'risk_score', 'confidence', 'clinical_analysis', 'orange_database_logic', 'recommendations', 'feature_importance']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("AI failed to generate a response. Please check your inputs.");
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI response:", text);
    throw new Error("Invalid diagnostic format received from AI.");
  }
};
