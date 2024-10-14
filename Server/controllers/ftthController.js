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
        Router_Casa: true,
        Router_Gestor: true,
      },
    });

    //Valida si el infoCliente está asociado con otros clientes(Servicios)

    const data = await Promise.all(
      ftth.map(async (r) => {
        let existCliente = false;

        //FTTH
        const otrosClientes = await prisma.cliente.findMany({
          where: { idInfoCliente: r.idInfoCliente },
        });

        const clienteIP = await prisma.ipPublica.findMany({
          where: { idInfoCliente: r.idInfoCliente },
        });

        //IP Pública
        if (otrosClientes.length > 1 || clienteIP.length > 1) {
          existCliente = true;
        }

        return {
          id: r.idCliente,
          fechaInstalacion: r.fechaInstalacion,
          tipoCliente: r.tipoCliente.nombre,
          cliente: r.infoCliente.nombre,
          agente: r.agente,
          idEstado: r.estado.idEstado,
          estado: r.estado.nombre,
          existCliente,
        };
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
        Router_Casa: true,
        Router_Gestor: true,
      },
    });

    if (ftth.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      id: ftth.idCliente,
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
      rcasa: ftth.Router_Casa,
      rgestor: ftth.Router_Gestor,
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
          numero: data.numero,
          nombre: data.nombre,
        },
      });

      await prisma.cliente_Condominio.create({
        data: {
          idInfoCliente: existClient.idInfoCliente,
          idCondominio: existCondominio.idCondominio,
          estado: 1, //Actual
        },
      });
    }

    //ONT - Actualizar
    await prisma.oNT.update({
      where: { idONT: data.idONT },
      data: {
        idEstado: 2,
      },
    });

    //Router - Gestor

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

    //Router - Casa
    await prisma.router_Casa.update({
      where: { idRouter_Casa: data.idRouter_Casa },
      data: {
        idEstado: 2,
      },
    });

    const router_gestor = await prisma.router_Gestor.create({
      data: {
        idOLT: data.idOLT,
        idSubred_OLT: subred.idRed,
        idZona_OLT: zona.idZona,
      },
    });

    const cliente = await prisma.cliente.create({
      data: {
        idInfoCliente: existClient.idInfoCliente,
        idTipo: data.idTipo,
        idONT: data.idONT,
        idEstado: data.idEstado,
        idRouter_Casa: data.idRouter_Casa,
        idRouter_Gestor: router_gestor.idRouter_Gestor,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        numOS: data.numOS,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        cloudMonitoreo: data.cloudMonitoreo,
        potenciaRecepcion: data.potenciaRecepcion,
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
      where: { idCliente: data.idCliente },
      include: {
        infoCliente: true,
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        Router_Gestor: {
          include: {
            olt: true,
            subred: true,
            zona: true,
          },
        },
        Router_Casa: true,
      },
    });

    //Condominio
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

      const existHistorialActual = await prisma.cliente_Condominio.findFirst({
        where: {
          idInfoCliente: ftth.idInfoCliente,
          estado: 1,
        },
      });

      if (existHistorialActual) {
        await prisma.cliente_Condominio.update({
          where: {
            idHistorial: existHistorialActual.idHistorial,
          },
          data: {
            estado: 2, //Residencia Pasada
          },
        });

        await prisma.cliente_Condominio.create({
          data: {
            idInfoCliente: ftth.idInfoCliente,
            idCondominio: existCondominio.idCondominio,
            estado: 1, //Residencia Actual
          },
        });
      }
    }

    //ONT
    let updateONT;

    if (data.idONT !== ftth.ont.idONT) {
      await prisma.oNT.update({
        where: { idONT: ftth.ont.idONT },
        data: {
          idEstado: 1,
        },
      });

      updateONT = await prisma.oNT.update({
        where: { idONT: data.idONT },
        data: {
          idEstado: 2,
        },
      });
    }

    //Router
    let zona;
    let newSubred;
    let newRouter;

    //En caso de cambio de OLT
    if (
      data.idOLT !== ftth.Router_Gestor.idOLT ||
      data.nombreZona !== ftth.Router_Gestor.zona.nombreZona ||
      data.ip !== ftth.Router_Gestor.subred.ip ||
      data.idRouter_Gestor !== ftth.Router_Gestor.idRouter_Gestor
    ) {
      if (data.ip !== ftth.Router_Gestor.subred.ip) {
        newSubred = await prisma.subred_OLT.update({
          where: { idRed: ftth.Router_Gestor.idSubred_OLT },
          data: {
            idOLT: data.idOLT,
            ip: data.ip,
          },
        });
      }

      if (data.nombreZona !== ftth.Router_Gestor.zona.nombreZona) {
        zona = await prisma.zona_OLT.update({
          where: { idZona: ftth.Router_Gestor.idZona_OLT },
          data: {
            idOLT: data.idOLT,
            nombreZona: data.nombreZona,
          },
        });
      }

      //Libera
      if (data.idRouter_Gestor !== ftth.Router_Gestor.idRouter_Gestor) {
        await prisma.router_Gestor.delete({
          where: { idRouter_Gestor: ftth.Router_Gestor.idRouter_Gestor },
        });
      }

      //En caso de cambio de Router-Gestor
      newRouter = await prisma.Router_Gestor.update({
        where: { idRouter_Gestor: data.idRouter_Gestor },
        data: {
          idSubred_OLT: newSubred ? newSubred.idRed : ftth.router.idSubred_OLT,
          idZona_OLT: zona ? zona.idZona : ftth.router.idZona_OLT,
          idOLT: data.idOLT,
        },
      });
    }

    //Router - Casa
    let rcasa;
    if (data.idRouter_Casa !== ftth.idRouter_Casa) {
      //Liberando - Dispositivo
      await prisma.router_Casa.update({
        where: { idRouter_Casa: ftth.idRouter_Casa },
        data: {
          idEstado: 1,
        },
      });

      //Asignando - Dispositivo
      rcasa = await prisma.router_Casa.update({
        where: { idRouter_Casa: data.idRouter_Casa },
        data: {
          idEstado: 2,
        },
      });
    }

    const cliente = await prisma.cliente.update({
      where: { idCliente: idCliente },
      data: {
        idTipo: data.idTipo,
        idONT: data.idONT,
        idEstado: data.idEstado,
        idRouter_Gestor: data.idRouter_Gestor,
        idRouter_Casa: data.idRouter_Casa,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        numOS: data.numOS,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        cloudMonitoreo: data.cloudMonitoreo,
        potenciaRecepcion: data.potenciaRecepcion,
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
        Router_Gestor: {
          include: {
            subred: true,
            zona: true,
            olt: true,
          },
        },
        Router_Casa: true,
      },
    });

    if (!cliente) {
      return response.status(404).json({ message: "Cliente no encontrado" });
    }

    //Procede a eliminar en cadena
    // Liberar Router_Casa
    if (cliente.Router_Casa) {
      await prisma.router_Casa.update({
        where: { idRouter_Casa: cliente.Router_Casa.idRouter_Casa },
        data: { idEstado: 1 },
      });
    }

    // Liberar ONT
    if (cliente.ont) {
      await prisma.oNT.update({
        where: { idONT: cliente.ont.idONT },
        data: { idEstado: 1 },
      });
    }

    // Eliminar Router_Gestor y sus dependencias
    if (cliente.Router_Gestor) {
      await prisma.router_Gestor.delete({
        where: { idRouter_Gestor: cliente.Router_Gestor.idRouter_Gestor },
      });

      if (cliente.Router_Gestor.zona) {
        await prisma.zona_OLT.delete({
          where: { idZona: cliente.Router_Gestor.idZona_OLT },
        });
      }

      if (cliente.Router_Gestor.subred) {
        await prisma.subred_OLT.delete({
          where: { idRed: cliente.Router_Gestor.idSubred_OLT },
        });
      }
    }

    // Eliminar infoCliente - Condominios - Historial (Cliente-Condominio)
    const existHistorial = await prisma.cliente_Condominio.findMany({
      where: {
        idInfoCliente: cliente.infoCliente.idInfoCliente,
      },
    });

    if (existHistorial.length !== 0) {
      
      // Eliminar historial de manera concurrente
      await prisma.cliente_Condominio.deleteMany({
        where: { idInfoCliente: cliente.infoCliente.idInfoCliente },
      });
      
      // Eliminar condominios de manera concurrente
      const deleteCondominios = existHistorial.map(async (i) => {
        await prisma.condominio.delete({
          where: { idCondominio: i.idCondominio },
        });
      });

      await Promise.all(deleteCondominios);

    }

    // Finalmente, eliminar el cliente
    await prisma.cliente.delete({
      where: { idCliente: cliente.idCliente },
    });

    await prisma.infoCliente.delete({
      where:{ idInfoCliente: cliente.infoCliente.idInfoCliente}
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
