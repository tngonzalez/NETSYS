const { PrismaClient, Prisma } = require("@prisma/client");
const { info } = require("console");
const { request, response } = require("express");
const prisma = new PrismaClient();

//Get All - L
module.exports.getRouter = async (request, response, next) => {
  try {
    const router = await prisma.router.findMany({
      orderBy: {
        idRouter: "asc",
      },
      include: {
        estado: true,
      },
    });

    const data = router.map((r) => ({
      id: r.idRouter,
      idEstado: r.idEstado,
      estado: r.estado.nombre,
      activo: r.numActivo,
      serie: r.serie,
      macAddress: r.macAddress,
      tipoDispositivo: r.tipoDispositivo,
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
    const router = await prisma.router.findUnique({
      where: {
        idRouter: idRouter,
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
      id: router.idRouter,
      idEstado: router.idEstado,
      estado: router.estado.nombre,
      activo: router.numActivo,
      serie: router.serie,
      macAddress: router.macAddress,
      tipoDispositivo: router.tipoDispositivo,
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

    const router = await prisma.router.findUnique({
      where: {
        idRouter: idRouter,
      },
      include: {
        estado: true,
        olt: true,
        zona: true,
        subred: true,
      },
    });

    if (router.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

  if (router.estado.idEstado === 2) {

    const get = await prisma.cliente.findFirst({
      where: {idRouter: idRouter},
      include: {
        estado: true,
        tipoCliente: true,
        bw: true,
        infoCliente: { include: {condominio: true}},
        router: { include: {subred: true, olt: true, zona: true }},
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
      router: get.router,
      agente: get.agente,
      cloudMonitoreo: get.cloudMonitoreo,
      comentario: get.comentario,
      cajaDerivada: get.cajaDerivada,
      numOS: get.numOS,
      fecha: get.fechaInstalacion
    };

    response.json({
      info
    });

    } else {
      const data = {
        id: router.idRouter,
        idEstado: router.idEstado,
        estado: router.estado.nombre,
        activo: router.numActivo,
        serie: router.serie,
        macAddress: router.macAddress,
        tipoDispositivo: router.tipoDispositivo,
        
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
    const router = await prisma.router.findMany({
      where: {
        idEstado: idEstado,
      },
      include: {
        estado: true,
        Cliente: true,
      },
    });

    if (router.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }
    const data = router.map((router) => ({
      id: router.idRouter,
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

//Delete -- Probar una vez módulo FTTH esté listo
module.exports.deteleRouter = async (request, response, next) => {
  let idRouter = parseInt(request.params.idRouter);
  try {
    const router = await prisma.router.findUnique({
      where: {
        idRouter: idRouter,
      },
      include: {
        estado: true,
        Cliente: true,
      },
    });

    if (router.idEstado === 1) {
      await prisma.router.delete({
        where: {
          idRouter: Number(idRouter),
        },
      });
    } else {
      await prisma.cliente.update({
        where: {
          idRouter: idRouter,
        },
        data: {
          idRouter: null,
        },
      });

      await prisma.subred_OLT.delete({
        where: {
          idOLT: Number(router.idOLT),
        },
      });

      await prisma.router.delete({
        where: {
          idRouter: Number(idRouter),
        },
      });
    }

    response.json("Eliminación exitosa");
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Create
module.exports.create = async (request, response, next) => {
  try {
    const { idEstado, numActivo, serie, macAddress, tipoDispositivo } =
      request.body;

    const newRouter = await prisma.router.create({
      data: {
        idEstado: idEstado,
        numActivo: numActivo,
        serie: serie,
        macAddress: macAddress,
        tipoDispositivo: tipoDispositivo,
        idOLT: null,
        idZona_OLT: null,
        idSubred_OLT: null,
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
    const { idEstado, activo, serie, macAddress, tipoDispositivo } =
      request.body;
    let idRouter = parseInt(request.params.idRouter);

    const oldRouter = await prisma.router.findUnique({
      where: {
        idRouter: Number(idRouter),
      },
    });

    if (!oldRouter) {
      return response.status(404).json({ message: "Router no encontrado" });
    }

    const newRouter = await prisma.router.update({
      where: { idRouter: idRouter },
      data: {
        idEstado: idEstado,
        numActivo: activo,
        serie: serie,
        macAddress: macAddress,
        tipoDispositivo: tipoDispositivo,
        idOLT: null,
        idZona_OLT: null,
        idSubred_OLT: null,
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
