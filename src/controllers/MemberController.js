const bcrypt = require("bcryptjs");
const MemberModel = require("../models/MemberModel");
const UserModel = require("../models/UserModel");

const MemberController = {
  list: async (request, response) => {
    const members = await MemberModel.list();
    return response.json(members);
  },

  myCard: async (request, response) => {
    const card = await MemberModel.findByUserId(request.user.id);

    if (!card) {
      return response.status(404).json({ message: "Carteirinha nao encontrada." });
    }

    return response.json(card);
  },

  create: async (request, response) => {
    const {
      fullName,
      email,
      password,
      modality,
      level,
      annuityValidUntil,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
      healthPlan,
    } = request.body;

    if (!fullName || !email || !password) {
      return response.status(400).json({ message: "Dados obrigatorios ausentes." });
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return response.status(409).json({ message: "E-mail ja cadastrado." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name: fullName,
      email,
      passwordHash,
      type: "usuario",
    });

    await MemberModel.create({
      userId: user.id,
      modality,
      level,
      annuityValidUntil,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
      healthPlan,
    });

    const card = await MemberModel.findByUserId(user.id);
    return response.status(201).json(card);
  },
};

module.exports = MemberController;
