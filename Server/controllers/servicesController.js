const { PrismaClient, Prisma } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getTipoCliente = async (request, response, next) => {
  try {
    const services = await prisma.tipoCliente.findMany({
      orderBy: {
        idTipo: "desc",
      },
      include: {
        Cliente: true,
      },
    });

    const data = services.map((r) => ({
      id: r.idTipo,
      nombre: r.nombre,
      existClientes: r.Cliente.length > 0 ? true : false,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getTipoClienteById = async (request, response, next) => {
  try {
    let idTipo = parseInt(request.params.idTipo);

    const services = await prisma.tipoCliente.findUnique({
      where: { idTipo: idTipo },
      include: {
        Cliente: {
          include: {
            estado: true,
          },
        },
      },
    });

    if (!services) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    //Agrupar clientes por estado
    const groupClienteByStatus = services.Cliente.reduce((acc, cliente) => {
      const estado = cliente.estado.nombre;
      if (!acc[estado]) {
        acc[estado] = [];
      }
      acc[estado].push(cliente);
      return acc;
    }, {});

    const data = {
      service: services.nombre,
      clienteEstado: groupClienteByStatus,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get Basic
module.exports.getTipoById = async (request, response, next) => {
  try {
    let idTipo = parseInt(request.params.idTipo);

    const services = await prisma.tipoCliente.findUnique({
      where: { idTipo: idTipo },
      include: {
        Cliente: {
          include: {
            estado: true,
          },
        },
      },
    });

    if (!services) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    //Agrupar clientes por estado
    const data = {
      id: services.idTipo,
      service: services.nombre,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.create = async (request, response, next) => {
  try {
    const data = request.body;

    const newService = await prisma.tipoCliente.create({
      data: {
        nombre: data.nombre,
      },
    });

    response.json({
      services: newService,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.update = async (request, response, next) => {
  try {
    const data = request.body;

    const newService = await prisma.tipoCliente.update({
      where: {
        idTipo: data.idTipo,
      },
      data: {
        nombre: data.nombre,
      },
    });

    response.json({
      services: newService,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya está en uso.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.delete = async (request, response, next) => {
  try {
    let idTipo = parseInt(request.params.idTipo);

    const data = await prisma.tipoCliente.delete({
      where: { idTipo: idTipo },
    });

    response.status(200).json({
      message: `Servicio eliminado con éxito.`,
      data,
    });
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte
module.exports.getServiceReport = async (request, response, next) => {
  try {
    const idTipo = parseInt(request.params.idTipo);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT t.nombre AS tipoCliente,
                      COUNT(CASE WHEN c.idEstado = '4' THEN 1 END) AS danado,
                      COUNT(CASE WHEN c.idEstado = '3' THEN 1 END) AS retiro,
                      COUNT(CASE WHEN c.idEstado = '1' THEN 1 END) AS activo,
                      COUNT(CASE WHEN c.idEstado = '2' THEN 1 END) AS suspensiones
                  FROM tipocliente t
                  LEFT JOIN cliente c ON t.idTipo = c.idTipo
                  LEFT JOIN infocliente i ON i.idInfoCliente = c.idInfoCliente 
                  WHERE t.idTipo = ${idTipo} GROUP BY t.nombre;`
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

module.exports.getClienteReport = async (request, response, next) => {
  try {
    const idTipo = parseInt(request.params.idTipo);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT e.idEstado, e.nombre, c.fechaInstalacion, i.nombre, c.cloudMonitoreo FROM tipoCliente t
                  JOIN cliente c ON t.idTipo = c.idTipo
                  JOIN infocliente i ON i.idInfoCliente = c.idInfoCliente 
                  JOIN estadoCliente e ON c.idEstado = e.idEstado
                  WHERE t.idTipo = ${idTipo}; `
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
