const { PrismaClient, Prisma } = require("@prisma/client");
const { info } = require("console");
const { request, response } = require("express");
const prisma = new PrismaClient();

//Get All - L
module.exports.getRouter = async (request, response, next) => {
  try {
    const router = await prisma.router_Casa.findMany({
      orderBy: {
        idRouter_Casa: "asc",
      },
      include: {
        estado: true,
      },
    });

    const data = await Promise.all(
      router.map(async (r) => {
        const cliente = await prisma.cliente.findUnique({
          where: {
            idRouter_Casa: r.idRouter_Casa,
          },
        });

        return {
          id: r.idRouter_Casa,
          idEstado: r.idEstado,
          estado: r.estado.nombre,
          activo: r.numActivo,
          serie: r.serie,
          macAddress: r.macAddress,
          existeRouter: cliente ? true : false,
        };
      })
    );

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

//GetById - Detalle Router
module.exports.getRouterDetailById = async (request, response, next) => {
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

    if (router.estado.idEstado === 2) {
      const get = await prisma.cliente.findFirst({
        where: { idRouter_Casa: idRouter },
        include: {
          estado: true,
          tipoCliente: true,
          bw: true,
          infoCliente: { include: { condominio: true } },
          Router_Casa: true,
          Router_Gestor: true,
          ont: true,
        },
      });

      const info = {
        tipoCliente: get.tipoCliente.nombre,
        estado: get.estado.nombre,
        numCliente: get.infoCliente.numero,
        nombreCliente: get.infoCliente.nombre,
        condominio: get.infoCliente.condominio.zona,
        numCasa: get.infoCliente.condominio.numCasa,
        bw: get.bw.nombre,
        kbps: get.BW_KBPS,
        ont: get.ont,
        router_casa: get.Router_Casa,
        router_gestor: get.Router_Gestor,
        agente: get.agente,
        cloudMonitoreo: get.cloudMonitoreo,
        comentario: get.comentario,
        cajaDerivada: get.cajaDerivada,
        numOS: get.numOS,
        fecha: get.fechaInstalacion,
      };

      response.json({
        info,
      });
    } else {
      const data = {
        id: router.idRouter_Casa,
        idEstado: router.idEstado,
        estado: router.estado.nombre,
        activo: router.numActivo,
        serie: router.serie,
        macAddress: router.macAddress,
      };
      response.json(data);
    }
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
    const { numActivo, serie, macAddress } =
      request.body;

    const newRouter = await prisma.router_Casa.create({
      data: {
        idEstado: 1,
        numActivo: numActivo,
        serie: serie,
        macAddress: macAddress
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
    const { idEstado, activo, serie, macAddress } =
      request.body;
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
        macAddress: macAddress
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

//Cantidad Asignados + Nombre Cliente + Info. Router / Lo mismo con Disponibles info.
