const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { parse } = require("path");
const { info } = require("console");

//Get All
module.exports.getAll = async (request, response, next) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        idUsuario: "desc",
      },
    });

    const data = usuarios.map((r) => ({
      id: r.idUsuario,
      tipoRol: r.tipoRol,
      nombre: r.nombre + " " + r.apellidos,
      correo: r.correo,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getUsuarioById = async (request, response, next) => {
  try {
    let idUsuario = parseInt(request.params.idUsuario);

    const usuarios = await prisma.usuario.findUnique({
      where: { idUsuario: idUsuario },
    });

    const data = {
      id: usuarios.idUsuario,
      tipoRol: usuarios.tipoRol,
      nombre: usuarios.nombre,
      apellidos: usuarios.apellidos,
      correo: usuarios.correo,
      clave: usuarios.clave,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Login
module.exports.login = async (request, response, next) => {
  try {
    let userData = request.body;

    // Verificar si el usuario existe
    if (!userData.correo || !userData.clave) {
      return response.status(401).json({
        message: "Correo y clave son requeridos.",
      });
    }

    // Buscar al usuario por correo
    const usuario = await prisma.usuario.findUnique({
      where: {
        correo: userData.correo,
      },
    });

    console.log(usuario);

    // Verificar si el usuario existe
    if (!usuario) {
      return response.status(401).json({
        message: "Datos erróneos. Usuario no encontrado.",
      });
    }

    // Comparar la contraseña
    const checkPassword = await bcrypt.compare(userData.clave, usuario.clave);

    if (checkPassword === false) {
      response.status(401).json("Credenciales no válidas");
    } else {
      const payload = {
        idUsuario: usuario.idUsuario,
        correo: usuario.correo,
        rol: usuario.tipoRol,
        nombre: usuario.nombre + ' ' + usuario.apellidos
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      response.json({message: "Bienvenido", token});
    }
  } catch (error) {
    console.error("Error en el proceso de login:", error);
    return response
      .status(500)
      .json({ message: "Error en la solicitud", error });
  }
};

//Create
module.exports.create = async (request, response, next) => {
  try {
    const infoUsuario = request.body;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(infoUsuario.clave, salt);

    const newUser = await prisma.usuario.create({
      data: {
        nombre: infoUsuario.nombre,
        apellidos: infoUsuario.apellidos,
        correo: infoUsuario.correo,
        clave: hash,
        tipoRol: parseInt(infoUsuario.tipoRol),
      },
    });

    response.json(newUser);
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe.`,
      });
    }
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    const infoUsuario = request.body;
    console.log(infoUsuario);

    const oldUser = await prisma.usuario.findUnique({
      where: {
        idUsuario: infoUsuario.idUsuario,
      },
    });

    const isMatchPass = await bcrypt.compare(infoUsuario.clave, oldUser.clave);

    if (isMatchPass) {
      const newUser = await prisma.usuario.update({
        where: { idUsuario: infoUsuario.idUsuario },
        data: {
          nombre: infoUsuario.nombre,
          apellidos: infoUsuario.apellidos,
          correo: infoUsuario.correo,
          clave: oldUser.clave,
          tipoRol: parseInt(infoUsuario.tipoRol),
        },
      });

      response.json(newUser);
    } else {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(infoUsuario.clave, salt);

      const newUser = await prisma.usuario.update({
        where: { idUsuario: infoUsuario.idUsuario },
        data: {
          nombre: infoUsuario.nombre,
          apellidos: infoUsuario.apellidos,
          correo: infoUsuario.correo,
          clave: hash,
          tipoRol: infoUsuario.tipoRol,
        },
      });

      response.json(newUser);
    }
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete
module.exports.detele = async (request, response, next) => {
  let idUsuario = parseInt(request.params.idUsuario);
  try {
    await prisma.usuario.delete({
      where: {
        idUsuario: Number(idUsuario),
      },
    });

    response.json("Eliminación exitosa");
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
