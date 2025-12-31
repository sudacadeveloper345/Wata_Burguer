
export const generateDescription = async (productName: string): Promise<string> => {
  try {
    // Ahora llamamos a nuestra función segura de Vercel
    const response = await fetch('/api/generate-description', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName }),
    });
    
    const data = await response.json();
    return data.text || "Sabor artesanal único con ingredientes premium seleccionados.";
  } catch (error) {
    console.error("Error llamando a la API segura:", error);
    return "Una explosión de sabor artesanal que no te puedes perder.";
  }
};
