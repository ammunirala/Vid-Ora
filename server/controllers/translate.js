export const translateText = async (req, res) => {
  try {
    const { text, target } = req.body;

    if (!text || !target) {
      return res.status(400).json({
        message: "Text and target language are required",
      });
    }

    const response = await fetch(
      "https://translate.fedilab.app/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: text,
          source: "auto",
          target,
          format: "text",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Translation service failed");
    }

    const data = await response.json();

    return res.status(200).json({
      translatedText: data.translatedText,
      detectedLanguage: data.detectedLanguage,
    });
  } catch (error) {
    console.error("Translation error:", error);

    return res.status(500).json({
      message: "Unable to translate comment",
    });
  }
};