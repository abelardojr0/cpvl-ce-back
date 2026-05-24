const bcrypt = require("bcryptjs");
const MemberModel = require("../models/MemberModel");
const UserModel = require("../models/UserModel");

const onlyNumbers = (value = "") => String(value).replace(/\D/g, "");
const passwordFromCpf = (cpf) => onlyNumbers(cpf).slice(0, 6);

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
      cpf,
      modality,
      level,
      annuityValidUntil,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
      healthPlan,
      photoUrl,
    } = request.body;

    if (!fullName || !email || !cpf || !photoUrl) {
      return response.status(400).json({ message: "Dados obrigatorios ausentes." });
    }

    const normalizedCpf = onlyNumbers(cpf);

    if (normalizedCpf.length !== 11) {
      return response.status(400).json({ message: "Informe um CPF valido." });
    }

    if (!level || typeof level !== "string" || !level.trim()) {
      return response.status(400).json({ message: "Informe o nivel do piloto." });
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser) {
      return response.status(409).json({ message: "E-mail ja cadastrado." });
    }

    const existingCpf = await UserModel.findByCpf(normalizedCpf);

    if (existingCpf) {
      return response.status(409).json({ message: "CPF ja cadastrado." });
    }

    const passwordHash = await bcrypt.hash(passwordFromCpf(normalizedCpf), 10);
    const user = await UserModel.create({
      name: fullName,
      email,
      cpf: normalizedCpf,
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
      cpf,
      modality,
      level,
      annuityValidUntil,
      bloodType,
      emergencyContactName,
      emergencyContactPhone,
      healthPlan,
      photoUrl,
    } = request.body;

    if (!fullName || !email || !cpf || !photoUrl) {
      return response.status(400).json({ message: "Dados obrigatorios ausentes." });
    }

    const normalizedCpf = onlyNumbers(cpf);

    if (normalizedCpf.length !== 11) {
      return response.status(400).json({ message: "Informe um CPF valido." });
    }

    if (!level || typeof level !== "string" || !level.trim()) {
      return response.status(400).json({ message: "Informe o nivel do piloto." });
    }

    const existingUser = await UserModel.findByEmail(email);

    if (existingUser && String(existingUser.id) !== String(userId)) {
      return response.status(409).json({ message: "E-mail ja cadastrado." });
    }

    const existingCpf = await UserModel.findByCpf(normalizedCpf);

    if (existingCpf && String(existingCpf.id) !== String(userId)) {
      return response.status(409).json({ message: "CPF ja cadastrado." });
    }

    const passwordHash = await bcrypt.hash(passwordFromCpf(normalizedCpf), 10);

    await UserModel.update({
      id: userId,
      name: fullName,
      email,
      cpf: normalizedCpf,
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
