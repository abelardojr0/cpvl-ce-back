const SettingsModel = require("../models/SettingsModel");

const SettingsController = {
  getSignature: async (request, response) => {
    const signature = await SettingsModel.getSignature();
    return response.json(signature);
  },

  saveSignature: async (request, response) => {
    const { signatureDataUrl } = request.body;

    if (
      !signatureDataUrl ||
      typeof signatureDataUrl !== "string" ||
      !signatureDataUrl.startsWith("data:image/png;base64,")
    ) {
      return response.status(400).json({ message: "Assinatura invalida." });
    }

    if (signatureDataUrl.length > 1_000_000) {
      return response.status(413).json({ message: "Assinatura muito grande." });
    }

    const signature = await SettingsModel.saveSignature({ signatureDataUrl });
    return response.json(signature);
  },
};

module.exports = SettingsController;
