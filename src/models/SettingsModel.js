const pool = require("../config/database");

const SIGNATURE_KEY = "digital_signature";
const PRESIDENT_NAME = "Roger Messala Pimentel Cajazeiras";

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
  presidentName: PRESIDENT_NAME,
  presidentRole: "Presidente",
};

const normalizeSignature = (signature = {}) => ({
  ...defaultSignature,
  ...signature,
  presidentName: PRESIDENT_NAME,
});

const SettingsModel = {
  getSignature: async () => {
    await ensureTable();

    const result = await pool.query(
      "SELECT value FROM app_settings WHERE key = $1",
      [SIGNATURE_KEY],
    );

    const signature = normalizeSignature(result.rows[0]?.value);

    if (result.rows[0]?.value?.presidentName !== PRESIDENT_NAME) {
      await pool.query(
        `UPDATE app_settings
         SET value = $2, updated_at = now()
         WHERE key = $1`,
        [SIGNATURE_KEY, signature],
      );
    }

    return signature;
  },

  saveSignature: async ({ signatureDataUrl }) => {
    await ensureTable();

    const value = normalizeSignature({ signatureDataUrl });

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
