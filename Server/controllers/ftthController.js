const { PrismaClient, Prisma } = require("@prisma/client");
const { response, Router } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getFTTH = async (request, response, next) => {
  try {
    const ftth = await prisma.cliente.findMany({
      orderBy: {
        idCliente: "desc",
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
        infoCliente: {
          include: {
            Cliente_Condominio: {
              where: { estado: 1 },
              include: {
                condominio: true,
              },
            },
          },
        },
        tipoCliente: true,
        ont: true,
        estado: true,
        bw: true,
        Router_Casa: true,
        Router_Gestor: {
          include: {
            subred: true,
            zona: true,
          },
        },
      },
    });

    if (ftth.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      id: ftth.idCliente,
      fechaInstalacion: ftth.fechaInstalacion,
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
      potenciaRecepcion: ftth.potenciaRecepcion,
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

    let cloudMonitoreo;

    if (data.idTipo === 2) {
      const existType = await prisma.cliente.count({
        where: {
          idTipo: 2,
        },
      });

      const newNum = (existType + 1).toString().padStart(3, "0");
      cloudMonitoreo = `PAN${newNum}_OS${data.numOS}_${data.numero}_${data.nombre}`;
    } else {
      cloudMonitoreo = `${data.numCasa}_OS${data.numOS}_${data.numero}_${data.nombre}_${data.zona}`;
    }

    const cliente = await prisma.cliente.create({
      data: {
        idInfoCliente: existClient.idInfoCliente,
        idTipo: data.idTipo,
        idONT: data.idONT,
        idEstado: 1,
        idRouter_Casa: data.idRouter_Casa,
        idRouter_Gestor: router_gestor.idRouter_Gestor,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        numOS: data.numOS,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        cloudMonitoreo: cloudMonitoreo,
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
      where: { idInfoCliente: cliente.infoCliente.idInfoCliente },
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
        Cliente_Condominio: {
          include: {
            condominio: true,
          },
        },
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

//Estado: Retiro
module.exports.updateStateRetiro = async (request, response, next) => {
  const data = request.body;
  try {
    const updateService = await prisma.cliente.update({
      where: { idCliente: data.idCliente },
      data: {
        idEstado: 3,
      },
    });

    const newRetiro = await prisma.retiro.create({
      data: {
        idCliente: data.idCliente,
        idEstadoR: data.idEstadoR,
        numOS: data.numOS,
        fechaDesinstalacion: data.fechaDesinstalacion,
        comentario: data.comentario,
        agente: data.agente,
      },
    });

    response.json(newRetiro);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Estado: Suspención
module.exports.updateStateSuspencion = async (request, response, next) => {
  const data = request.body;
  try {
    const updateService = await prisma.cliente.update({
      where: { idCliente: data.idCliente },
      data: {
        idEstado: 2,
      },
    });

    const newSuspencion = await prisma.suspencion.create({
      data: {
        idCliente: data.idCliente,
        fechaSuspencion: data.fechaSuspencion,
      },
    });

    response.json(newSuspencion);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Estado: Dañado
async function updateDispositivo(
  prisma,
  dispositivo,
  direcActual,
  direcNueva,
  idCliente
) {
  if (dispositivo === "ONT") {
    await prisma.oNT.update({
      where: { macAddress: direcActual },
      data: { idEstado: 1 }, 
    });

    await prisma.oNT.update({
      where: { macAddress: direcNueva },
      data: { idEstado: 2 }, 
    });

    const ont = await prisma.oNT.findUnique({
      where: { macAddress: direcNueva },
    });

    await prisma.cliente.update({
      where: { idCliente: idCliente },
      data: { idONT: ont.idONT },
    });

  } else {
    await prisma.router_Casa.update({
      where: { macAddress: direcActual },
      data: { idEstado: 1 },
    });

    await prisma.router_Casa.update({
      where: { macAddress: direcNueva },
      data: { idEstado: 2 }, 
    });

    const router = await prisma.router_Casa.findUnique({
      where: { macAddress: direcNueva },
    });

    await prisma.cliente.update({
      where: { idCliente: idCliente },
      data: { idRouter_Casa: router.idRouter_Casa },
    });
  }
}

module.exports.createStateDanado = async (request, response, next) => {
  const {
    idCliente,
    fechaInstalacion,
    dispositivo1,
    direcNueva1,
    direcActual1,
    comentario,
    idTipoDano1,
    idDanado,
    dispositivo2,
    direcNueva2,
    direcActual2,
  } = request.body;

  try {
    if (!dispositivo1 || !direcActual1 || !idTipoDano1) {
      return response
        .status(400)
        .json({ message: "Datos incompletos para el primer dispositivo" });
    }

    await prisma.$transaction(async (prisma) => {
      //Creación del primer dispositivo
      await prisma.danado.upsert({
        where:  {idDanado: idDanado || -1, direccionActual: direcActual1},
        update: {
          fechaInstalacion: fechaInstalacion || null,
          direccionNueva: direcNueva1 || null,
          comentario: comentario || null,
        },
        create: {
          idCliente: idCliente,
          fechaInstalacion: fechaInstalacion || null,
          dispositivo: dispositivo1,
          direccionNueva: direcNueva1 || null,
          direccionActual: direcActual1,
          comentario: comentario || null,
          idTipoDano: idTipoDano1,
        },
      });

      //Dependiendo del tipo de dispositivo actualice el estado del dispositivo
      //Liberando el dispostivo y asignado otro a ftth
      if (fechaInstalacion !== null && direcNueva1 !== null) {
        await prisma.cliente.update({
          where: { idCliente: idCliente },
          data: {
            idEstado: 1,
          },
        });
      } else {
        await prisma.cliente.update({
          where: { idCliente: idCliente },
          data: {
            idEstado: 4,
          },
        });
      }

      await updateDispositivo(
        prisma,
        dispositivo1,
        direcActual1,
        direcNueva1,
        idCliente
      );

      //Segundo Dispositivo
      if (dispositivo2 && direcActual2) {

        await prisma.danado.upsert({
          where: { idDanado: idDanado + 1 || -1, direccionActual: direcActual2 },
          update: {
            fechaInstalacion: fechaInstalacion || null,
            direccionNueva: direcNueva2 || null,
            comentario: comentario || null,
          },
          create: {
            idCliente: idCliente,
            fechaInstalacion: fechaInstalacion || null,
            dispositivo: dispositivo2,
            direccionNueva: direcNueva2 || null,
            direccionActual: direcActual2,
            comentario: comentario || null,
            idTipoDano: idTipoDano1,
          },
        });

        if (fechaInstalacion !== null && direcNueva2 !== null) {
          await prisma.cliente.update({
            where: { idCliente: idCliente },
            data: {
              idEstado: 1,
            },
          });
        } else {
          await prisma.cliente.update({
            where: { idCliente: idCliente },
            data: {
              idEstado: 4,
            },
          });
        }

        await updateDispositivo(
          prisma,
          dispositivo2,
          direcActual2,
          direcNueva2,
          idCliente
        );
      }
    });

    response.status(201).json();
  } catch (error) {
    //console.error("Detalles del error:", error);
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetEstado
module.exports.getEstado = async (request, response, next) => {
  try {
    const { idCliente, idEstado } = request.body;

    if (idEstado == 2) {
      let suspencion = await prisma.suspencion.findMany({
        where: {
          idCliente: parseInt(idCliente),
        },
      });

      suspencion = suspencion.map((susp) => {
        const [day, month, year] = susp.fechaSuspencion.split("/");
        return {
          ...susp,
          fechaDate: new Date(`${year}-${month}-${day}`),
        };
      });

      suspencion.sort((a, b) => b.fechaDate - a.fechaDate);

      response.json(suspencion[0]);
    } else if (idEstado == 3) {
      let retiro = await prisma.retiro.findFirst({
        where: {
          idCliente: parseInt(idCliente),
        },
      });

      response.json(retiro);
    } else {
      let dano = await prisma.danado.findMany({
        where: {
          idCliente: parseInt(idCliente),
          fechaInstalacion: null,
          direccionNueva: null,
          comentario: null,
        },
      });

      response.json(dano);
    }
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
