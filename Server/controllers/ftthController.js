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
          ontMAC: r.ont.macAddress,
          routerMAC: r.Router_Casa.macAddress,
        };
      })
    );
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
            olt: true,
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
    let id = parseInt(request.params.id);
    const data = request.body;
    console.log(data);
    const ftth = await prisma.cliente.findUnique({
      where: { idCliente: data.id },
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
    let newSubred;
    let newRouter;

    //En caso de cambio de OLT
    if (
      data.idOLT !== ftth.Router_Gestor.idOLT ||
      data.ip !== ftth.Router_Gestor.subred.ip ||
      data.idRouter_Gestor !== ftth.Router_Gestor.idRouter_Gestor
    ) {
      if (data.ip !== ftth.Router_Gestor.subred.ip) {
        newSubred = await prisma.subred_OLT.update({
          where: { idRed: ftth.Router_Gestor.idSubred_OLT },
          data: {
            idOLT: parseInt(data.idOLT),
            ip: data.ip,
          },
        });
      }

      //Libera Router
      if (data.idRouter_Gestor !== ftth.Router_Gestor.idRouter_Gestor) {
        await prisma.router_Gestor.delete({
          where: { idRouter_Gestor: ftth.Router_Gestor.idRouter_Gestor },
        });

        newRouter = await prisma.Router_Gestor.create({
          data: {
            idSubred_OLT: newSubred
              ? newSubred.idRed
              : ftth.Router_Gestor.idSubred_OLT,
            idOLT: parseInt(data.idOLT),
          },
        });
      } else {
        //En caso de cambio de Router-Gestor
        newRouter = await prisma.Router_Gestor.update({
          where: { idRouter_Gestor: data.idRouter_Gestor },
          data: {
            idSubred_OLT: newSubred
              ? newSubred.idRed
              : ftth.Router_Gestor.idSubred_OLT,
            idOLT: parseInt(data.idOLT),
          },
        });
      }
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
      where: { idCliente: data.id },
      data: {
        idONT: data.idONT,
        idEstado: data.idEstado,
        idRouter_Gestor: data.idRouter_Gestor,
        idRouter_Casa: data.idRouter_Casa,
        idBW: data.idBW,
        BW_KBPS: data.kbps,
        cajaDerivada: data.cajaDerivada,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        potenciaRecepcion: data.potenciaRecepcion,
      },
    });

    response.json(cliente);
  } catch (error) {
    console.error("Error al actualizar:", error);

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
            olt: true,
            subred: true,
            Cliente: true,
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
    await prisma.cliente.update({
      where: { idCliente: data.idCliente },
      data: {
        idEstado: 3,
      },
    });

    let newRetiro;

    if (!data.idRetiro) {
      newRetiro = await prisma.retiro.create({
        data: {
          idCliente: data.idCliente,
          idEstadoR: data.idEstadoR,
          numOS: data.numOS || null,
          fechaDesinstalacion: data.fechaDesinstalacion || null,
          comentario: data.comentario || null,
          agente: data.agente,
        },
      });

      //Actualizar - IPTV

      const iptvDatos = await prisma.iPTV.findMany({
        where: { idCliente: data.idCliente },
      });

      if (iptvDatos.length > 0) {
        await prisma.iPTV.updateMany({
          where: { idCliente: data.idCliente },
          data: {
            idEstado: 3,
          },
        });
      }
    } else {
      newRetiro = await prisma.retiro.update({
        where: { idRetiro: data.idRetiro },
        data: {
          idCliente: data.idCliente,
          idEstadoR: data.idEstadoR,
          numOS: data.numOS,
          fechaDesinstalacion: data.fechaDesinstalacion,
          comentario: data.comentario,
          agente: data.agente,
        },
      });
    }

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

    //Actualizar - IPTV
    const iptvDatos = await prisma.iPTV.findMany({
      where: { idCliente: data.idCliente },
    });

    if (iptvDatos.length > 0) {
      await prisma.iPTV.updateMany({
        where: { idCliente: data.idCliente },
        data: {
          idEstado: 2,
        },
      });
    }

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
      data: { idEstado: 3 },
    });

    if (direcNueva !== null && direcNueva !== direcActual) {
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
    }
  } else {
    await prisma.router_Casa.update({
      where: { macAddress: direcActual },
      data: { idEstado: 3 },
    });

    if (direcNueva !== null && direcNueva !== direcActual) {
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
}

module.exports.createStateDanado = async (request, response, next) => {
  const data = request.body;

  try {
    if (!data.dispositivo || !data.direcActual || !data.idTipoDano) {
      return response
        .status(400)
        .json({ message: "Datos incompletos para el primer dispositivo" });
    }

    if (!data.idDanado) {
      await prisma.danado.create({
        data: {
          idCliente: data.idCliente,
          fechaInstalacion: data.fechaInstalacion || null,
          dispositivo: data.dispositivo,
          direccionNueva: data.direcNueva,
          direccionActual: data.direcActual,
          comentario: data.comentario || null,
          idTipoDano: data.idTipoDano,
        },
      });
    } else {
      await prisma.danado.update({
        where: {
          idDanado: data.idDanado,
          direccionActual: data.direcActual,
        },
        data: {
          fechaInstalacion: data.fechaInstalacion || null,
          direccionNueva: data.direcNueva,
          comentario: data.comentario || null,
        },
      });
    }

    //Dependiendo del tipo de dispositivo actualice el estado del dispositivo
    //Liberando el dispostivo y asignado otro a ftth
    if (data.direcNueva === data.direcActual) {
      await prisma.cliente.update({
        where: { idCliente: data.idCliente },
        data: {
          idEstado: 4,
        },
      });
    } else {
      await prisma.cliente.update({
        where: { idCliente: data.idCliente },
        data: {
          idEstado: 1,
        },
      });
    }

    await updateDispositivo(
      prisma,
      data.dispositivo,
      data.direcActual,
      data.direcNueva,
      data.idCliente
    );

    response.status(201).json();
  } catch (error) {
    //console.error("Detalles del error:", error);
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Estado: Activado
module.exports.updateStateActivo = async (request, response, next) => {
  const data = request.body;

  try {
    const updateCliente = await prisma.cliente.update({
      where: { idCliente: data.idCliente },
      data: {
        idEstado: 1,
      },
    });

    //Actualizar - IPTV
    const iptvDatos = await prisma.iPTV.findMany({
      where: { idCliente: data.idCliente },
    });

    if (iptvDatos.length > 0) {
      await prisma.iPTV.updateMany({
        where: { idCliente: data.idCliente },
        data: {
          idEstado: 1,
        },
      });
    }

    response.json(updateCliente);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetEstado
module.exports.getEstado = async (request, response, next) => {
  try {
    const data = request.body;

    if (data.idEstado == 2) {
      let suspencion = await prisma.suspencion.findMany({
        where: {
          idCliente: parseInt(data.idCliente),
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
    } else if (data.idEstado == 3) {
      let retiro = await prisma.retiro.findFirst({
        where: {
          idCliente: parseInt(data.idCliente),
        },
      });

      response.json(retiro);
    } else {
      let danado = await prisma.danado.findMany({
        where: {
          idCliente: parseInt(data.idCliente),
        },
      });

      danado = danado.map((susp) => {
        const [day, month, year] = susp.fechaInstalacion.split("/");
        return {
          ...susp,
          fechaDate: new Date(`${year}-${month}-${day}`),
        };
      });

      danado.sort((a, b) => b.fechaDate - a.fechaDate);

      response.json(danado[0]);
    }
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte
module.exports.getCondominioReport = async (request, response, next) => {
  try {
    const idCliente = parseInt(request.params.idCliente);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT c.numCasa, c.zona 
                  FROM condominio c
                  JOIN cliente_condominio h ON h.idCondominio = c.idCondominio
                  JOIN infocliente i ON i.idInfoCliente = h.idInfoCliente
                  JOIN cliente m ON m.idInfoCliente = i.idInfoCliente
                  WHERE h.estado = 2 AND m.idCliente = ${idCliente};`
    );
    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getEstadoReport = async (request, response, next) => {
  try {
    const idCliente = parseInt(request.params.idCliente);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT r.fechaDesinstalacion AS Fecha, 'Retiro' AS Tipo, r.idCliente
                  FROM retiro r
                  WHERE r.idCliente = ${idCliente}

                  UNION ALL

                  SELECT s.fechaSuspencion AS Fecha, 'Suspencion' AS Tipo, s.idCliente
                  FROM suspencion s
                  WHERE s.idCliente = ${idCliente}

                  UNION ALL

                  SELECT d.fechaInstalacion AS Fecha, 'Dañado' AS Tipo, d.idCliente
                  FROM danado d
                  WHERE d.idCliente = ${idCliente};`
    );
    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getFTTHReport = async (request, response, next) => {
  try {
    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT c.idCliente, e.idEstado, e.nombre, c.fechaInstalacion, i.nombre, c.cloudMonitoreo, t.nombre AS tipo FROM tipoCliente t
                  JOIN cliente c ON t.idTipo = c.idTipo
                  JOIN infocliente i ON i.idInfoCliente = c.idInfoCliente 
                  JOIN estadoCliente e ON c.idEstado = e.idEstado;`
    );

    const conversion_BigInt_String = result.map((item) => {
      const data = { ...item };
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "bigint") {
          data[key] = data[key].toString();
        }
      });
      return data;
    });

    response.json(conversion_BigInt_String);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte - Dashboard
module.exports.getService1 = async (request, response, next) => {
  try {
    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT t.nombre AS tipoCliente,
                COUNT(DISTINCT c.idCliente) AS cantClientes,
                SUM(CASE WHEN e.idEstado = 1 THEN 1 ELSE 0 END) AS activo,
                SUM(CASE WHEN e.idEstado = 4 THEN 1 ELSE 0 END) AS danando,
                SUM(CASE WHEN e.idEstado = 2 THEN 1 ELSE 0 END) AS suspension,
                SUM(CASE WHEN e.idEstado = 3 THEN 1 ELSE 0 END) AS retiro
                FROM cliente c
                JOIN tipocliente t ON c.idTipo = t.idTipo
                JOIN estadocliente e ON c.idEstado = e.idEstado 
                GROUP BY  t.nombre ORDER BY COUNT(DISTINCT c.idCliente) DESC LIMIT 1;`
    );

    const conversion_BigInt_String = result.map((item) => {
      const data = { ...item };
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "bigint") {
          data[key] = data[key].toString();
        }
      });
      return data;
    });

    response.json(conversion_BigInt_String);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getService2 = async (request, response, next) => {
  try {
    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT t.nombre AS tipoCliente,
                COUNT(DISTINCT c.idCliente) AS cantClientes,
                SUM(CASE WHEN e.idEstado = 1 THEN 1 ELSE 0 END) AS activo,
                SUM(CASE WHEN e.idEstado = 4 THEN 1 ELSE 0 END) AS danando,
                SUM(CASE WHEN e.idEstado = 2 THEN 1 ELSE 0 END) AS suspension,
                SUM(CASE WHEN e.idEstado = 3 THEN 1 ELSE 0 END) AS retiro
                FROM cliente c
                JOIN tipocliente t ON c.idTipo = t.idTipo
                JOIN estadocliente e ON c.idEstado = e.idEstado
                GROUP BY t.nombre ORDER BY cantClientes DESC
                LIMIT 1 OFFSET 1;`
        );

    const conversion_BigInt_String = result.map((item) => {
      const data = { ...item };
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "bigint") {
          data[key] = data[key].toString();
        }
      });
      return data;
    });

    response.json(conversion_BigInt_String);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
