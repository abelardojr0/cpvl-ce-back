const pool = require("../config/database");

const publicUserFields = "id, name, email, cpf, type, created_at";

const ensureCpfColumn = async () => {
  await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS cpf VARCHAR(20)");
  await pool.query(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf) WHERE cpf IS NOT NULL",
  );
};

const UserModel = {
  findByEmail: async (email) => {
    await ensureCpfColumn();

    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  findById: async (id) => {
    await ensureCpfColumn();

    const result = await pool.query(
      `SELECT ${publicUserFields} FROM users WHERE id = $1`,
      [id],
    );
    return result.rows[0];
  },

  create: async ({ name, email, cpf, passwordHash, type = "usuario" }) => {
    await ensureCpfColumn();

    const result = await pool.query(
      `INSERT INTO users (name, email, cpf, password_hash, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${publicUserFields}`,
      [name, email, cpf, passwordHash, type],
    );
    return result.rows[0];
  },

  findByCpf: async (cpf) => {
    await ensureCpfColumn();

    const result = await pool.query("SELECT * FROM users WHERE cpf = $1", [
      cpf,
    ]);
    return result.rows[0];
  },

  update: async ({ id, name, email, cpf, passwordHash }) => {
    await ensureCpfColumn();

    const fields = ["name = $1", "email = $2", "cpf = $3", "updated_at = now()"];
    const values = [name, email, cpf];

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

  deleteById: async (id) => {
    await ensureCpfColumn();

    const result = await pool.query(
      `DELETE FROM users
       WHERE id = $1 AND type = 'usuario'
       RETURNING ${publicUserFields}`,
      [id],
    );

    return result.rows[0];
  },
};

module.exports = UserModel;
