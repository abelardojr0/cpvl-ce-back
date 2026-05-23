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

  findByUserId: async (request, response) => {
    const card = await MemberModel.findByUserId(request.params.userId);

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
      photoUrl,
    } = request.body;

    if (!fullName || !email || !password || !photoUrl) {
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
      photoUrl,
    });

    const card = await MemberModel.findByUserId(user.id);
    return response.status(201).json(card);
  },

  update: async (request, response) => {
    const { userId } = request.params;
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
      photoUrl,
    } = request.body;

    if (!fullName || !email || !photoUrl) {
      return response.status(400).json({ message: "Dados obrigatorios ausentes." });
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser && String(existingUser.id) !== String(userId)) {
      return response.status(409).json({ message: "E-mail ja cadastrado." });
    }

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;

    await UserModel.update({
      id: userId,
      name: fullName,
      email,
      passwordHash,
    });

    await MemberModel.updateByUserId(userId, {
      modality,
      level,
      annuityValidUntil,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
      healthPlan,
      photoUrl,
    });

    const card = await MemberModel.findByUserId(userId);
    return response.json(card);
  },

  delete: async (request, response) => {
    const deletedUser = await UserModel.deleteById(request.params.userId);

    if (!deletedUser) {
      return response.status(404).json({ message: "Usuario nao encontrado." });
    }

    return response.status(204).send();
  },
};

module.exports = MemberController;
