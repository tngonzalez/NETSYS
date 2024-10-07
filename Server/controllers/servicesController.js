const { PrismaClient, Prisma } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getTipoCliente = async (request, response, next) => {
  try {
    const services = await prisma.tipoCliente.findMany({
      orderBy: {
        idTipo: "asc",
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

//Get By Id -- Salesforce
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
        where: {idTipo: idTipo},
    }); 

    response.status(200).json({
        message: `Servicio eliminado con éxito.`,
        data,
    });

  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
