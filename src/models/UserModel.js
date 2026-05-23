const pool = require("../config/database");

const publicUserFields = "id, name, email, type, created_at";

const UserModel = {
  findByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query(
      `SELECT ${publicUserFields} FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  },

  create: async ({ name, email, passwordHash, type = "usuario" }) => {
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, type)
       VALUES ($1, $2, $3, $4)
       RETURNING ${publicUserFields}`,
      [name, email, passwordHash, type],
    );
    return result.rows[0];
  },

  update: async ({ id, name, email, passwordHash }) => {
    const fields = ["name = $1", "email = $2", "updated_at = now()"];
    const values = [name, email];

    if (passwordHash) {
      fields.push(`password_hash = $${values.length + 1}`);
      values.push(passwordHash);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE users
       SET ${fields.join(", ")}
       WHERE id = $${values.length}
       RETURNING ${publicUserFields}`,
      values,
    );

    return result.rows[0];
  },
};

module.exports = UserModel;
