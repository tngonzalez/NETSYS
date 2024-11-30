const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//Get All
module.exports.get = async (request, response, next) => {
  try {
    const dataONT = await prisma.oNT.findMany({
      orderBy: {
        idONT: "desc",
      },
      include: {
        estado: true,
      },
    });

    const data = dataONT.map((o) => ({
      id: o.idONT,
      idEstado: o.idEstado,
      estado: o.estado.nombre,
      numActivo: o.numActivo,
      macAddress: o.macAddress,
      numSN: o.numSN,
    }));

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
      estado: ont.estado.nombre,
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
    const { numActivo, numSN, macAddress } = request.body;

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
    const { idEstado, numActivo, numSN, macAddress } = request.body;

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

module.exports.getONTReport = async (request, response, next) => {
  try {
    const idONT = parseInt(request.params.idONT);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT o.numActivo, o.numSN, o.macAddress, c.cloudMonitoreo AS monitoreo, 
                i.nombre AS nombreCliente, t.nombre as tipoCliente FROM ont o
                JOIN cliente c ON o.idONT = c.idONT
                JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente 
                JOIN tipocliente t ON c.idTipo = t.idTipo 
                WHERE o.idONT = ${idONT};`
    );

    if (result.length === 0) {
      result = await prisma.$queryRaw(
        Prisma.sql`SELECT o.numActivo, o.numSN, o.macAddress FROM ont o WHERE o.idONT = ${idONT};`
      );
    }

    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.getGeneralReport = async (request, response, next) => {
  try {
    const result = await prisma.$queryRaw(
      Prisma.sql`SELECT e.idEstado, e.nombre, o.numActivo, o.numSN as serie, o.macAddress, i.nombre AS nombreCliente
                  FROM ont o LEFT JOIN cliente c ON o.idONT = c.idONT
                  LEFT JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente 
                  LEFT JOIN estadoactivo e ON e.idEstado = o.idEstado;`
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
    console.error("Error ejecutando la consulta:", error);
    response.status(500).json({ error: "Error interno del servidor" });
  }
};
