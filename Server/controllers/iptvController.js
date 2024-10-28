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
        estado: true,
        dns: true,
      },
    });

    const data = servicio.map((s) => ({
      id: s.idIPTV,
      fechaInstalacion: s.fechaInstalacion,
      numCliente: s.cliente.infoCliente.numero,
      nombreCliente: s.cliente.infoCliente.nombre,
      estado: s.estado.nombre,
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
        estado: true,
        dns: true,
      },
    });

    if (servicio.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      clienteNum: servicio.cliente.infoCliente.numero,
      clienteNombre: servicio.cliente.infoCliente.nombre,
      clienteCloud: servicio.cliente.cloudMonitoreo,

      idEstado: servicio.idEstado,

      idDNS: servicio.idDNS,

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
        idDNS: data.idDNS,
        fechaInstalacion: data.fechaInstalacion,
        comentario: data.comentario,
        agente: data.agente,
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

    const iptv = await prisma.findUnique({
      where: { idIPTV: data.idIPTV },
    });

    //DNS - Actualizar estado
    if (data.idDNS !== iptv.idDNS) {
      if (data.idEstado === 4) {
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
      where: { idDNS: data.idDNS },
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