const pool = require("../config/database");

const SIGNATURE_KEY = "digital_signature";

const ensureTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS app_settings (
      key VARCHAR(80) PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
};

const defaultSignature = {
  signatureDataUrl: null,
  presidentName: "José Clenylson Campos Cordeiro",
  presidentRole: "Presidente",
};

const SettingsModel = {
  getSignature: async () => {
    await ensureTable();

    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = $1",
      [SIGNATURE_KEY],
    );

    return result.rows[0]?.value || defaultSignature;
  },

  saveSignature: async ({ signatureDataUrl }) => {
    await ensureTable();

    const value = {
      ...defaultSignature,
      signatureDataUrl,
    };

    const result = await pool.query(
      `INSERT INTO app_settings (key, value, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = now()
       RETURNING value`,
      [SIGNATURE_KEY, value],
    );

    return result.rows[0].value;
  },
};

module.exports = SettingsModel;
