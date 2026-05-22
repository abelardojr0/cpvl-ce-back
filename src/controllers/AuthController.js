const bcrypt = require("bcryptjs");
const UserModel = require("../models/UserModel");
const { signToken } = require("../utils/auth");

const AuthController = {
  login: async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "E-mail e senha obrigatorios." });
    }

    const user = await UserModel.findByEmail(email);

    if (!user) {
      return response.status(401).json({ message: "Credenciais invalidas." });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return response.status(401).json({ message: "Credenciais invalidas." });
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
    };

    return response.json({
      token: signToken(safeUser),
      user: safeUser,
    });
  },

  me: async (request, response) => {
    const user = await UserModel.findById(request.user.id);
    return response.json(user);
  },

  forgotPassword: async (request, response) => {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({ message: "Informe o e-mail." });
    }

    return response.json({
      message:
        "Solicitacao recebida. Configure o envio de e-mail para concluir o fluxo.",
    });
  },
};

module.exports = AuthController;
