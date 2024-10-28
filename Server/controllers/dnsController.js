const { PrismaClient, Prisma } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getAll = async (request, response, next) => {
  try {
    const dns = await prisma.dNS_Stick.findMany({
      orderBy: {
        idDNS: "desc",
      },
      include: {
        estado: true,
        iptv: true, 
      },
    });

    const data = dns.map((r) => ({
      id: r.idDNS,
      correo: r.correo,
      macAddress: r.macAddress,
      dns: r.dns, 
      estado: r.estado.nombre,
      idEstado: r.idEstado,
      existIPTV: r.iptv.length > 0 ? true : false,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getById = async (request, response, next) => {
  try {
    let idDNS = parseInt(request.params.idDNS);

    const dns = await prisma.dNS_Stick.findUnique({
      where: { idDNS: idDNS },
      include: {
        estado: true,
        iptv: true, 
      },
    });

    if (!dns) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
        id: dns.idDNS,
        correo: dns.correo,
        macAddress: dns.macAddress,
        dns: dns.dns, 
        estado: dns.estado.nombre,
        idEstado: dns.idEstado,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.create = async (request, response, next) => {
  try {
    const data = request.body;

    const newDNS = await prisma.dNS_Stick.create({
      data: {
        idEstado: 1,
        nombre: data.nombre,
        correo: data.correo,
        clave: data.clave,
        macAddress: data.macAddress,
        dns: data.dns,
      },
    });

    response.json(newDNS);

  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.update = async (request, response, next) => {
  try {
    const data = request.body;

    const newDNS = await prisma.dNS_Stick.update({
        where: {idDNS: data.idDNS},
        data: {
          nombre: data.nombre,
          correo: data.correo,
          clave: data.clave,
          macAddress: data.macAddress,
          dns: data.dns,
        },
      });

    response.json(newDNS);
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya está en uso.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.delete = async (request, response, next) => {
  try {
    let idDNS = parseInt(request.params.idDNS);

    await prisma.dNS_Stick.delete({
        where: {idDNS: idDNS},
    }); 

    response.status(200).json({
        message: `DNS eliminado con éxito.`
    });

  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
