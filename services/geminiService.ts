
import { GoogleGenAI } from "@google/genai";

// Accedemos a la API KEY de forma segura desde el entorno del servidor
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDescription = async (productName: string): Promise<string> => {
  try {
    // Usamos el modelo más rápido y eficiente para descripciones
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un chef experto. Crea una descripción corta (máximo 80 caracteres), irresistible y gourmet para un plato llamado "${productName}". Usa palabras que despierten el hambre.`,
      config: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
      }
    });
    
    return response.text || "Sabor artesanal único con ingredientes premium seleccionados.";
  } catch (error) {
    console.error("Error de Seguridad/Conexión con Gemini:", error);
    return "Una explosión de sabor artesanal que no te puedes perder.";
  }
};
