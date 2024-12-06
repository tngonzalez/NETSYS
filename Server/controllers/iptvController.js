const { PrismaClient, Prisma } = require("@prisma/client");
const { response, Router } = require("express");
const { request } = require("http");
const prisma = new PrismaClient();

//Get All
module.exports.getAll = async (request, response, next) => {
  try {
    const servicio = await prisma.iPTV.findMany({
      orderBy: {
        idIPTV: "desc",
      },
      include: {
        cliente: {
          include: { infoCliente: true },
        },
        estadoServicio: true,
        estadoInst: true,
        dsn: true,
      },
    });

    const data = servicio.map((s) => ({
      id: s.idIPTV,
      fechaInstalacion: s.fechaInstalacion,
      numCliente: s.cliente.infoCliente.numero,
      nombreCliente: s.cliente.infoCliente.nombre,
      estado: s.estadoServicio.nombre,
      idEstado: s.idEstado,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By IdIPTV
module.exports.getByIdIPTV = async (request, response, next) => {
  try {
    let idIPTV = parseInt(request.params.idIPTV);

    const servicio = await prisma.iPTV.findUnique({
      where: { idIPTV: idIPTV },
      include: {
        cliente: {
          include: { infoCliente: true, tipoCliente: true },
        },
        estadoInst: true,
        estadoServicio: true,
        dsn: true,
      },
    });

    if (servicio.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      id: servicio.idIPTV,

      clienteNum: servicio.cliente.infoCliente.numero,
      clienteNombre: servicio.cliente.infoCliente.nombre,
      clienteCloud: servicio.cliente.cloudMonitoreo,
      idCliente: servicio.idCliente,

      numOS: servicio.numOS,

      idEstado: servicio.idEstado,

      idDSN: servicio.idDSN,
      mac: servicio.dsn.macAddress,
      dsn: servicio.dsn.dsn,
      usuario: servicio.dsn.usuario,

      idEstadoInstalacion: servicio.idEstadoInstalacion,

      fechaInstalacion: servicio.fechaInstalacion,

      comentario: servicio.comentario,

      agente: servicio.agente,
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

    //dsn - Actualizar estado
    await prisma.dSN_Stick.update({
      where: { idDSN: data.idDSN },
      data: {
        idEstado: 2,
      },
    });

    //Validacion de clientes los mostrará en la tabla de clientes

    const iptv = await prisma.iPTV.create({
      data: {
        idCliente: parseInt(data.idCliente),
        idEstado: 1,
        idEstadoInstalacion: parseInt(data.idEstadoInstalacion),
        idDSN: parseInt(data.idDSN),
        fechaInstalacion: data.fechaInstalacion || null,
        comentario: data.comentario || null,
        agente: data.agente || null,
        numOS: parseInt(data.numOS)
      },
    });

    response.json(iptv);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    const data = request.body;

    const iptv = await prisma.iPTV.findUnique({
      where: { idIPTV: data.idIPTV },
    });

    //dsn - Actualizar estado
    if (data.idDSN !== iptv.idDSN) {
      if (data.danado === true) {
        await prisma.dsn_Stick.update({
          where: { idDSN: iptv.idDSN },
          data: {
            idEstado: 3,
          },
        });

        await prisma.dsn_Stick.update({
          where: { idDSN: data.idDSN },
          data: {
            idEstado: 2,
          },
        });
      } else {
        await prisma.dsn_Stick.update({
          where: { idDSN: data.idDSN },
          data: {
            idEstado: 2,
          },
        });

        await prisma.dsn_Stick.update({
          where: { idDSN: iptv.idDSN },
          data: {
            idEstado: 1,
          },
        });
      }
    }

    //Validacion de clientes los mostrará en la tabla de clientes

    const datos = await prisma.iPTV.update({
      where: { idIPTV: data.idIPTV },
      data: {
        idCliente: data.idCliente,
        idEstado: data.idEstado,
        idEstadoInstalacion: data.idEstadoInstalacion,
        idDSN: data.idDSN,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
      },
    });

    response.json(datos);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete
module.exports.detele = async (request, response, next) => {
  let idIPTV = parseInt(request.params.idIPTV);

  try {
    const iptv = await prisma.iPTV.findUnique({
      where: { idIPTV: idIPTV },
    });

    await prisma.dSN_Stick.update({
      where: {
        idDSN: iptv.idDSN,
      },
      data: {
        idEstado: 1,
      },
    });

    await prisma.iPTV.delete({
      where: {
        idIPTV: idIPTV,
      },
    });

    response.json("Eliminación exitosa");
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Lista de cliente disponibles para crear un IPTV según BW

module.exports.getClientesByBW = async (request, response, next) => {
  try {
    const clientes_20mbps = await prisma.cliente.findMany({
      where: {
        idEstado: 1,
        bw: { nombre: "20/20 Mbps" },
        IPTV: {
          none: {},
        },
      },
      select: {
        idCliente: true,
        cloudMonitoreo: true,
        infoCliente: {
          select: {
            nombre: true,
            numero: true,
          },
        },
      },
    });

    // Obtener los clientes de 30 Mbps y contar IPTV por separado
    const clientes_30mbps_raw = await prisma.cliente.findMany({
      where: {
        idEstado: 1,
        bw: { nombre: { in: ["30/30 Mbps", "40/40 Mbps"] } },
      },
      select: {
        idCliente: true,
        cloudMonitoreo: true,
        IPTV: true, // Traer la relación IPTV completa
        infoCliente: {
          select: {
            nombre: true,
            numero: true,
          },
        },
      },
    });

    const clientes_30mbps = clientes_30mbps_raw.filter(
      (cliente) => cliente.IPTV.length < 2 // Filtrar clientes con menos de 2 servicios IPTV
    );

    // Obtener los clientes de 50 Mbps y contar IPTV por separado
    const clientes_50mbps_raw = await prisma.cliente.findMany({
      where: {
        idEstado: 1,
        bw: {
          nombre: {
            in: [
              "50/50 Mbps",
              "60/60 Mbps",
              "70/70 Mbps",
              "80/80 Mbps",
              "90/90 Mbps",
              "100/100 Mbps",
            ],
          },
        },
      },
      select: {
        idCliente: true,
        cloudMonitoreo: true,
        IPTV: true, // Traer la relación IPTV completa
        infoCliente: {
          select: {
            nombre: true,
            numero: true,
          },
        },
      },
    });

    const clientes_50mbps = clientes_50mbps_raw.filter(
      (cliente) => cliente.IPTV.length < 3 // Filtrar clientes con menos de 3 servicios IPTV
    );

    const clientesDisponibles = [
      ...clientes_20mbps,
      ...clientes_30mbps,
      ...clientes_50mbps,
    ].map((cliente) => ({
      idCliente: cliente.idCliente,
      nombre: cliente.infoCliente.nombre,
      numero: cliente.infoCliente.numero,
      cloud: cliente.cloudMonitoreo,
    }));

    response.json(clientesDisponibles);
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetIPTVById -- Reporte
module.exports.getIPTVReport = async (request, response, next) => {
  try {
    let idIPTV = parseInt(request.params.idIPTV);

    const servicio = await prisma.iPTV.findUnique({
      where: { idIPTV: idIPTV },
      include: {
        cliente: {
          include: {
            tipoCliente: true,
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
          },
        },
        estadoInst: true,
        estadoServicio: true,
        dsn: true,
      },
    });

    if (servicio.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    //Trae la cantidad servicio IPTV bajo el nombre del cliente
    const cantServicio = await prisma.iPTV.count({
      where: {
        cliente: {
          idCliente: servicio.cliente.idCliente,
        },
      },
    });

    //Trae la cantidad de servicio IPTV bajo el nombre del cliente (Instalados)
    const cantInstalados = await prisma.iPTV.count({
      where: {
        cliente: {
          idCliente: servicio.cliente.idCliente,
        },
        estadoInst: { idEstado: servicio.idEstadoInstalacion }, // Asegúrate de ajustar el valor del estado según tu base de datos
      },
    });

    //Consecutivo 
    const clienteCloud = `${servicio.cliente.tipoCliente.nombre.slice(0, 3).toUpperCase()}${String(
      servicio.idIPTV
    ).padStart(3, "0")}`;


    let data = {}; 

    if (servicio.cliente.tipoCliente.nombre !== "Panica") {
      data = {
        infoCliente: servicio.cliente.infoCliente,
        dsn: servicio.dsn,
        fechaInstalacion: servicio.fechaInstalacion, 
        cantidad: cantServicio,
        numOS: servicio.numOS,
      };
    }
    else {
       data = {
        infoCliente: servicio.cliente.infoCliente,
        dsn: servicio.dsn,
        fechaInstalacion: servicio.fechaInstalacion, 
        tipoCliente: servicio.cliente.tipoCliente.nombre,
        cantidad: cantServicio, 
        consecutivo: clienteCloud,
        instalados: cantInstalados,
        numOS: servicio.numOS,
      };
    }

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getReportGeneral = async (request, response, next) => {
  try {

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT p.idIPTV,  e.idEstado, e.nombre, p.fechaInstalacion, i.nombre, c.cloudMonitoreo, t.nombre AS tipo 
                FROM cliente c JOIN iptv p ON c.idCliente = p.idCliente
                JOIN infoCliente i ON c.idInfoCliente = i.idInfoCliente
                JOIN estadoCliente e ON  c.idEstado = e.idEstado
                JOIN tipoCliente t ON c.idTipo = t.idTipo;`
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


