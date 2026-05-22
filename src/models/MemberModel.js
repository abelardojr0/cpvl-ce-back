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
  mc.status,
  mc.created_at AS "createdAt"
`;

const MemberModel = {
  list: async () => {
    const result = await pool.query(
      `SELECT ${selectFields}
       FROM member_cards mc
       INNER JOIN users u ON u.id = mc.user_id
       ORDER BY u.name ASC`,
    );
    return result.rows;
  },

  findByUserId: async (userId) => {
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
    const result = await pool.query(
      `INSERT INTO member_cards (
        user_id,
        modality,
        level,
        annuity_valid_until,
        blood_type,
        emergency_contact_name,
        emergency_contact_phone,
        health_plan
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
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
      ],
    );
    return result.rows[0];
  },
};

module.exports = MemberModel;
