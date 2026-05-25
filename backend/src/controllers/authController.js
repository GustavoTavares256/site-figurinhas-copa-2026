const {
  createAdmin,
  loginAdmin
} = require("../services/authService");

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const admin = await createAdmin(
      name,
      email,
      password
    );

    return res.status(201).json({
      message: "Admin criado com sucesso!",
      admin
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Erro ao criar admin."
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const data = await loginAdmin(
      email,
      password
    );

    return res.status(200).json(data);

  } catch (error) {
    console.log(error);

    return res.status(401).json({
      message: "Email ou senha inválidos."
    });
  }
}

module.exports = {
  register,
  login
};