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
        dns: true,
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
          include: { infoCliente: true },
        },
        estadoInst: true,
        estadoServicio: true,
        dns: true,
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

      idEstado: servicio.idEstado,

      idDNS: servicio.idDNS,
      mac: servicio.dns.macAddress,
      dns:  servicio.dns.dns,
      email: servicio.dns.correo,

      idEstadoInstalacion: servicio.idEstadoInstalacion,
    
      fechaInstalacion: servicio.fechaInstalacion,

      comentario: servicio.comentario,

      agente: servicio.agente,

      macAddress: servicio.macAddress,

      correo: servicio.correo,

      clave: servicio.clave,
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

    //DNS - Actualizar estado
    await prisma.dNS_Stick.update({
      where: { idDNS: data.idDNS },
      data: {
        idEstado: 2,
      },
    });

    //Validacion de clientes los mostrará en la tabla de clientes

    const iptv = await prisma.iPTV.create({
      data: {
        idCliente: data.idCliente,
        idEstado: 1,
        idEstadoInstalacion: data.idEstadoInstalacion,
        idDNS: data.idDNS || null,
        fechaInstalacion: data.fechaInstalacion || null,
        comentario: data.comentario || null,
        agente: data.agente || null,
        macAddress: data.macAddress,
        correo: data.correo,
        clave: data.clave,
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

    //DNS - Actualizar estado
    if (data.idDNS !== iptv.idDNS) {
      
      if (data.danado === true) {
        await prisma.dNS_Stick.update({
          where: { idDNS: iptv.idDNS }, 
          data: {
            idEstado: 3,
          },
        });

        await prisma.dNS_Stick.update({
          where: { idDNS: data.idDNS },
          data: {
            idEstado: 2,
          },
        });
      } else {
        await prisma.dNS_Stick.update({
          where: { idDNS: data.idDNS },
          data: {
            idEstado: 2,
          },
        });

        await prisma.dNS_Stick.update({
          where: { idDNS: iptv.idDNS },
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
        idDNS: data.idDNS,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
        macAddress: data.macAddress,
        correo: data.correo,
        clave: data.clave,
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

    await prisma.dNS_Stick.update({
      where: {
        idDNS: iptv.idDNS,
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
        bw: { nombre: { in: ["50/50 Mbps", "60/60 Mbps", "70/70 Mbps", "80/80 Mbps", "90/90 Mbps", "100/100 Mbps"] } },
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
    ].map(cliente => ({
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

