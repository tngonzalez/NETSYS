const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//Get All
module.exports.get = async (request, response, next) => {
  try {
    const dataONT = await prisma.oNT.findMany({
      orderBy: {
        idONT: "asc",
      },
      include: {
        estado: true,
      },
    });

    const data = await Promise.all(
      dataONT.map(async (o) => {
        const Cliente = await prisma.cliente.findUnique({
          where: { idONT: o.idONT },
        });

        return {
          id: o.idONT,
          idEstado: o.idEstado,
          estado: o.estado.nombre,
          numActivo: o.numActivo,
          macAddress: o.macAddress,
          numSN: o.numSN,
          existeCliente: Cliente ? true : false,
        };
      })
    );

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getONTById = async (request, response, next) => {
  try {
    let idONT = parseInt(request.params.idONT);

    const dataONT = await prisma.oNT.findUnique({
      where: { idONT: idONT },
      include: {
        estado: true,
      },
    });

    const datos = {
      id: dataONT.idONT,
      idEstado: dataONT.idEstado,
      estado: dataONT.estado.nombre,
      numActivo: dataONT.numActivo,
      macAddress: dataONT.macAddress,
      numSN: dataONT.numSN,
    };
    response.json(datos);

  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetByEstado
module.exports.getONTByEstado = async (request, response, next) => {
  try {
    let idEstado = parseInt(request.params.idEstado);
    const ont = await prisma.oNT.findMany({
      where: {
        idEstado: idEstado,
      },
      include: {
        estado: true,
      },
    });

    if (ont.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }
    const data = ont.map((ont) => ({
      id: ont.idONT,
      idEstado: ont.idEstado,
      numActivo: ont.numActivo,
      numSN: ont.numSN,
      macAdd: ont.macAddress,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete
module.exports.deteleONT = async (request, response, next) => {
  let idONT = parseInt(request.params.idONT);

  try {
    await prisma.oNT.delete({
      where: {
        idONT: idONT,
      },
    });

    response.json("Eliminación exitosa");
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Create
module.exports.create = async (request, response, next) => {
  try {
    const {numActivo, numSN, macAddress} = request.body;

    const newONT = await prisma.oNT.create({
      data: {
        idEstado: 1,
        numActivo: numActivo,
        macAddress: macAddress,
        numSN: numSN,
      },
    });

    response.json(newONT);

  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe. Por favor, intente con otro ONT`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    let idONT = parseInt(request.params.idONT);
    const {idEstado, numActivo, numSN, macAddress} = request.body;

    const newONT = await prisma.oNT.update({
      where: {
        idONT: idONT,
      },
      data: {
        idEstado: idEstado,
        numActivo: numActivo,
        macAddress: macAddress,
        numSN: numSN,
      },
    });

    response.json(newONT);
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
