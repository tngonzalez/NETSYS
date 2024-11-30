const { PrismaClient, Prisma } = require("@prisma/client");
const { info } = require("console");
const { request, response } = require("express");
const prisma = new PrismaClient();

//Get All - L
module.exports.getRouter = async (request, response, next) => {
  try {
    const router = await prisma.router_Casa.findMany({
      orderBy: {
        idRouter_Casa: "desc",
      },
      include: {
        estado: true,
      },
    });

    const data = router.map((r) => ({
      id: r.idRouter_Casa,
      idEstado: r.idEstado,
      estado: r.estado.nombre,
      activo: r.numActivo,
      serie: r.serie,
      macAddress: r.macAddress,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetById
module.exports.getRouterById = async (request, response, next) => {
  try {
    let idRouter = parseInt(request.params.idRouter);
    const router = await prisma.router_Casa.findUnique({
      where: {
        idRouter_Casa: idRouter,
      },
      include: {
        estado: true,
      },
    });

    if (router.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      id: router.idRouter_Casa,
      idEstado: router.idEstado,
      estado: router.estado.nombre,
      activo: router.numActivo,
      serie: router.serie,
      macAddress: router.macAddress,
    };
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetByEstado
module.exports.getRouterByEstado = async (request, response, next) => {
  try {
    let idEstado = parseInt(request.params.idEstado);
    const router = await prisma.router_Casa.findMany({
      where: {
        idEstado: idEstado,
      },
      include: {
        estado: true,
      },
    });

    if (router.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }
    const data = router.map((router) => ({
      id: router.idRouter_Casa,
      idEstado: router.idEstado,
      estado: router.estado.nombre,
      activo: router.numActivo,
      serie: router.serie,
      macAddress: router.macAddress,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete - L
module.exports.deteleRouter = async (request, response, next) => {
  let idRouter = parseInt(request.params.idRouter);
  try {
    await prisma.router_Casa.delete({
      where: {
        idRouter_Casa: Number(idRouter),
      },
    });

    response.json("Eliminación exitosa");
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Create
module.exports.create = async (request, response, next) => {
  try {
    const { numActivo, serie, macAddress } = request.body;

    const newRouter = await prisma.router_Casa.create({
      data: {
        idEstado: 1,
        numActivo: numActivo,
        serie: serie,
        macAddress: macAddress,
      },
    });

    response.json(newRouter);
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe. Por favor, intente con otro router`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    const { idEstado, activo, serie, macAddress } = request.body;
    let idRouter = parseInt(request.params.idRouter);

    const oldRouter = await prisma.router_Casa.findUnique({
      where: {
        idRouter_Casa: Number(idRouter),
      },
    });

    if (!oldRouter) {
      return response.status(404).json({ message: "Router no encontrado" });
    }

    const newRouter = await prisma.router_Casa.update({
      where: { idRouter_Casa: idRouter },
      data: {
        idEstado: idEstado,
        numActivo: activo,
        serie: serie,
        macAddress: macAddress,
      },
    });

    response.json(newRouter);
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya está en uso. Por favor, ingrese valores único.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte

module.exports.getRouterReport = async (request, response, next) => {
  try {
    const idRouter = parseInt(request.params.idRouter);

    let result = await prisma.$queryRaw(
      Prisma.sql `SELECT r.numActivo, r.serie, r.macAddress, c.cloudMonitoreo AS monitoreo, 
                  i.nombre AS nombreCliente, t.nombre as tipoCliente, s.ip FROM router_casa r 
                  JOIN cliente c ON r.idRouter_Casa = c.idRouter_Casa 
                  JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente 
                  JOIN tipocliente t ON c.idTipo = t.idTipo 
                  JOIN router_gestor g ON c.idRouter_Gestor = g.idRouter_Gestor
                  JOIN subred_olt s ON g.idSubred_OLT = s.idRed
                  WHERE r.idRouter_Casa = ${idRouter};`
    );

    if (result.length === 0) {
      result = await prisma.$queryRaw(
        Prisma.sql `SELECT r.numActivo, r.serie, r.macAddress FROM router_casa r WHERE r.idRouter_Casa = ${idRouter};`
      );
    }

    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getGeneralReport =  async (request, response, next) => {
  try {

    const result = await prisma.$queryRaw(
      Prisma.sql `SELECT e.idEstado, e.nombre, r.numActivo, r.serie, r.macAddress, i.nombre AS nombreCliente FROM router_casa r LEFT JOIN cliente c ON r.idRouter_Casa = c.idRouter_Casa LEFT JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente LEFT JOIN estadoactivo e ON e.idEstado = r.idEstado;`
    );

    const conversion_BigInt_String = result.map(item => {
      const data = { ...item };
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'bigint') {
          data[key] = data[key].toString();
        }
      });
      return data;
    });
    response.json(conversion_BigInt_String);

  } catch (error) {
    console.error("Error ejecutando la consulta:", error);
    response.status(500).json({ error: "Error interno del servidor" });
  }
}
