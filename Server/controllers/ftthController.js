const { PrismaClient, Prisma } = require("@prisma/client");
const { response, Router } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getFTTH = async (request, response, next) => {
  try {
    const ftth = await prisma.cliente.findMany({
      orderBy: {
        idCliente: "asc",
      },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        router: true,
      },
    });

    //Validar si el infoCliente está asociado con otros clientes(Servicios)

    const data = await Promise.all(
      ftth.map(async (r) => {
        let existCliente = false; 

        //FTTH
        const otrosClientes = await prisma.cliente.findMany({
          where: {idInfoCliente: r.idInfoCliente},
        });

        const clienteIP = await prisma.ipPublica.findMany({
          where: {idInfoCliente: r.idInfoCliente, }, 
        });

        //IP Pública
        if(otrosClientes.length > 1  || clienteIP.length > 1){

          existCliente = true;

        };

        return {
          idCliente: r.idCliente,
          fechaInstalacion: r.fechaInstalacion,
          tipoCliente: r.tipoCliente.nombre,
          cliente: r.infoCliente.nombre,
          agente: r.agente,
          idEstado: r.estado.idEstado,
          estado: r.estado.nombre,
          existCliente,
        }
      })
    );
    response.json(data);


  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id -- Salesforce
module.exports.getFTTHByIdUpdate = async (request, response, next) => {
  try {
    let idCliente = parseInt(request.params.idCliente);

    const ftth = await prisma.cliente.findUnique({
      where: { idCliente: idCliente },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        router: true,
      },
    });

    if (ftth.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      fechaInstalacion: ftth.fecInstalacion,
      numOS: ftth.numOS,
      estado: ftth.estado,
      tipoCliente: ftth.tipoCliente.nombre,
      bw: ftth.bw.nombre,
      BW_KBPS: ftth.BW_KBPS,
      agente: ftth.agente,
      cloudMonitoreo: ftth.cloudMonitoreo,
      comentario: ftth.comentario,
      cajaDerivada: ftth.cajaDerivada,
      router: ftth.router,
      ont: ftth.ont,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetById - Normal
module.exports.getFTTHById = async (request, response, next) => {
  try {
    let idCliente = parseInt(request.params.idCliente);

    const ftth = await prisma.cliente.findUnique({
      where: { idCliente: idCliente },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        router: true,
      },
    });

    if (ftth.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      fechaInstalacion: ftth.fecInstalacion,
      numOS: ftth.numOS,
      estado: ftth.estado,
      tipoCliente: ftth.tipoCliente,
      bw: ftth.bw,
      infoCliente: ftth.infoCliente,
      BW_KBPS: ftth.BW_KBPS,
      agente: ftth.agente,
      cloudMonitoreo: ftth.cloudMonitoreo,
      comentario: ftth.comentario,
      cajaDerivada: ftth.cajaDerivada,
      router: ftth.router,
      ont: ftth.ont,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  try {
    const data = request.body;

    let existCondominio = await prisma.condominio.findFirst({
      where: {
        zona: data.zona,
        numCasa: data.numCasa,
      },
    });

    if (existCondominio === null && data.zona !== null) {
      existCondominio = await prisma.condominio.create({
        data: {
          zona: data.zona,
          numCasa: data.numCasa,
        },
      });
    }

    let existClient = await prisma.infoCliente.findUnique({
      where: {
        numero: data.numero,
      },
    });

    if (existClient === null) {
      existClient = await prisma.infoCliente.create({
        data: {
          idCondominio: existCondominio.idCondominio,
          numero: data.numero,
          nombre: data.nombre,
        },
      });
    }

    //ONT
    const newONT = await prisma.oNT.create({
      data: {
        potenciaRecepcion: data.potenciaRecepcion,
        numActivo: data.numActivo,
        macAddress: data.macAddress,
        numSN: data.numSN,
      },
    });

    //Router

    const zona = await prisma.zona_OLT.create({
      data: {
        idOLT: data.idOLT,
        nombreZona: data.nombreZona,
      },
    });
    //Valores - Metodo en OLT
    const subred = await prisma.subred_OLT.create({
      data: {
        idOLT: data.idOLT,
        ip: data.ip,
      },
    });

    await prisma.router.update({
      where: { idRouter: data.idRouter },
      data: {
        idEstado: 2,
        idSubred_OLT: subred.idRed,
        idZona_OLT: zona.idZona,
        idOLT: data.idOLT,
      },
    });

    const cliente = await prisma.cliente.create({
      data: {
        idInfoCliente: existClient.idInfoCliente,
        idTipo: data.idTipo,
        idONT: newONT.idONT,
        idEstado: data.idEstado,
        idRouter: data.idRouter,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        numOS: data.numOS,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        cloudMonitoreo: data.cloudMonitoreo,
      },
    });

    response.json(cliente);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    let idCliente = parseInt(request.params.idCliente);
    const data = request.body;

    const ftth = await prisma.cliente.findUnique({
      where: { idCliente: idCliente },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        router: {
          include: {
            olt: true,
            estado: true,
            subred: true,
            zona: true,
          },
        },
      },
    });

    console.log(ftth);
    //ONT
    const updateONT = await prisma.oNT.update({
      where: { idONT: ftth.ont.idONT },
      data: {
        potenciaRecepcion: data.potenciaRecepcion,
        numActivo: data.numActivo,
        macAddress: data.macAddress,
        numSN: data.numSN,
      },
    });

    //Router
    let zona;
    let newSubred;
    //En caso de cambio de OLT
    if (data.idOLT !== ftth.router.idOLT) {
      newSubred = await prisma.subred_OLT.update({
        where: { idRed: ftth.router.idSubred_OLT },
        data: {
          idOLT: data.idOLT,
          ip: data.ip,
        },
      });

      zona = await prisma.zona_OLT.update({
        where: { idZona: ftth.router.idZona_OLT },
        data: {
          idOLT: data.idOLT,
          nombreZona: data.nombreZona,
        },
      });
    }

    //En caso de cambio de Router
    //Asigna
    const newRouter = await prisma.router.update({
      where: { idRouter: data.idRouter },
      data: {
        idEstado: 2,
        idSubred_OLT: newSubred ? newSubred.idRed : ftth.router.idSubred_OLT,
        idZona_OLT: zona ? zona.idZona : ftth.router.idZona_OLT,
        idOLT: data.idOLT,
      },
    });

    //Libera
    if (data.idRouter !== ftth.router.idRouter) {
      await prisma.router.update({
        where: { idRouter: ftth.router.idRouter },
        data: {
          idEstado: 1,
          idOLT: null,
          idSubred_OLT: null,
          idZona_OLT: null,
        },
      });
    }

    const cliente = await prisma.cliente.update({
      where: { idCliente: idCliente },
      data: {
        idTipo: data.idTipo,
        idONT: updateONT.idONT,
        idEstado: data.idEstado,
        idRouter: newRouter.idRouter,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        numOS: data.numOS,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        cloudMonitoreo: data.cloudMonitoreo,
      },
    });

    response.json(cliente);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete
module.exports.delete = async (request, response, next) => {
  try {
    let idCliente = parseInt(request.params.idCliente);

    const cliente = await prisma.cliente.findUnique({
      where: { idCliente: idCliente },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        router: {
          include: {
            subred: true,
            zona: true,
          },
        },
      },
    });

    if (!cliente) {
      return response.status(404).json({ message: "Cliente no encontrado" });
    }

    //Validar si el infoCliente está asociado con otros clientes(Servicios)

    //FTTH
    const otrosClientes = await prisma.cliente.findMany({
      where: { idInfoCliente: cliente.idInfoCliente },
    });

    //IP Pública
    if (otrosClientes.length <= 1) {
      const clienteIP = await prisma.ipPublica.findMany({
        where: {
          idInfoCliente: cliente.idInfoCliente,
        },
      });

      if (clienteIP.length > 0) {
        await prisma.infoCliente.delete({
          where: { idInfoCliente: cliente.idInfoCliente },
        });
      }
    }

    //Procede a eliminar en cadena

    await prisma.cliente.delete({
      where: { idCliente: cliente.idCliente },
    });

    await prisma.oNT.delete({
      where: { idONT: cliente.ont.idONT },
    });

    await prisma.zona_OLT.delete({
      where: { idZona: cliente.router.idZona_OLT },
    });

    await prisma.subred_OLT.delete({
      where: { idRed: cliente.router.idSubred_OLT },
    });

    await prisma.router.update({
      where: { idRouter: cliente.router.idRouter },
      data: {
        idEstado: 1,
        idOLT: null,
        idSubred_OLT: null,
        idZona_OLT: null,
      },
    });

    response.status(200).json({
      message: `Servicio eliminado con éxito.`,
    });
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte

//GetInfoCliente
module.exports.getInfoCliente = async (request, response, next) => {
  try {
    const info = await prisma.infoCliente.findMany({
      orderBy: {
        idInfoCliente: "asc",
      },
      include: {
        condominio: true,
      },
    });

    const data = info.map((r) => ({
      id: r.idInfoCliente,
      nombre: r.nombre,
      numero: r.numero,

    }));
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetBW
module.exports.getBW = async (request, response, next) => {
  try {
    const info = await prisma.bW.findMany({
      orderBy: {
        idBW: "asc",
      },
    });

    const data = info.map((r) => ({
      id: r.idBW,
      bw: r.nombre,

    }));
    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};