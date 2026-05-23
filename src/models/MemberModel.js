const pool = require("../config/database");

const selectFields = `
  mc.id,
  mc.user_id AS "userId",
  u.name AS "fullName",
  u.email,
  mc.modality,
  mc.level,
  to_char(mc.annuity_valid_until, 'YYYY-MM') AS "annuityValidUntil",
  mc.blood_type AS "bloodType",
  mc.emergency_contact_name AS "emergencyContactName",
  mc.emergency_contact_phone AS "emergencyContactPhone",
  mc.health_plan AS "healthPlan",
  mc.photo_url AS "photoUrl",
  mc.status,
  mc.created_at AS "createdAt"
`;

const ensurePhotoColumn = async () => {
  await pool.query("ALTER TABLE member_cards ADD COLUMN IF NOT EXISTS photo_url TEXT");
};

const MemberModel = {
  list: async () => {
    await ensurePhotoColumn();

    const result = await pool.query(
      `SELECT ${selectFields}
       FROM member_cards mc
       INNER JOIN users u ON u.id = mc.user_id
       ORDER BY u.name ASC`,
    );
    return result.rows;
  },

  findByUserId: async (userId) => {
    await ensurePhotoColumn();

    const result = await pool.query(
      `SELECT ${selectFields}
       FROM member_cards mc
       INNER JOIN users u ON u.id = mc.user_id
       WHERE mc.user_id = $1`,
      [userId],
    );
    return result.rows[0];
  },

  create: async (payload) => {
    await ensurePhotoColumn();

    const result = await pool.query(
      `INSERT INTO member_cards (
        user_id,
        modality,
        level,
        annuity_valid_until,
        blood_type,
        emergency_contact_name,
        emergency_contact_phone,
        health_plan,
        photo_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        payload.userId,
        payload.modality,
        payload.level,
        `${payload.annuityValidUntil}-01`,
        payload.bloodType,
        payload.emergencyContactName,
        payload.emergencyContactPhone,
        payload.healthPlan,
        payload.photoUrl,
      ],
    );
    return result.rows[0];
  },

  updateByUserId: async (userId, payload) => {
    await ensurePhotoColumn();

    const result = await pool.query(
      `UPDATE member_cards
       SET
        modality = $1,
        level = $2,
        annuity_valid_until = $3,
        blood_type = $4,
        emergency_contact_name = $5,
        emergency_contact_phone = $6,
        health_plan = $7,
        photo_url = $8,
        updated_at = now()
       WHERE user_id = $9
       RETURNING *`,
      [
        payload.modality,
        payload.level,
        `${payload.annuityValidUntil}-01`,
        payload.bloodType,
        payload.emergencyContactName,
        payload.emergencyContactPhone,
        payload.healthPlan,
        payload.photoUrl,
        userId,
      ],
    );

    return result.rows[0];
  },
};

module.exports = MemberModel;
