
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Acceso no autorizado' }), { 
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { productName } = await req.json();
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Error de configuración en el servidor' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un chef experto de la hamburguesería "Wataburguer". Crea una descripción corta (máximo 80 caracteres), irresistible y gourmet para un plato llamado "${productName}". Usa palabras que despierten el hambre y un tono premium.`,
    });

    return new Response(JSON.stringify({ text: response.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error interno en la generación' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
