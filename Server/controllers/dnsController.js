const { PrismaClient, Prisma } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getAll = async (request, response, next) => {
  try {
    const dsn = await prisma.dSN_Stick.findMany({
      orderBy: {
        idDSN: "desc",
      },
      include: {
        estado: true,
        iptv: true, 
      },
    });

    const data = dsn.map((r) => ({
      id: r.idDSN,
      usuario: r.usuario,
      macAddress: r.macAddress,
      dsn: r.dsn, 
      estado: r.estado.nombre,
      idEstado: r.idEstado,
      existIPTV: r.iptv.length > 0 ? true : false,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getById = async (request, response, next) => {
  try {
    let idDSN = parseInt(request.params.idDSN);

    const dsn = await prisma.dSN_Stick.findUnique({
      where: { idDSN: idDSN },
      include: {
        estado: true,
        iptv: true, 
      },
    });

    if (!dsn) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      id: dsn.idDSN,
      nombre: dsn.nombre,
      usuario: dsn.usuario,
      clave: dsn.clave,
      macAddress: dsn.macAddress,
      serie: dsn.dsn,
      idEstado: dsn.idEstado,
      estado: dsn.estado.nombre,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getByIdEstado = async (request, response, next) => {
  try {
    let idEstado = parseInt(request.params.idEstado);

    const dsn = await prisma.dSN_Stick.findMany({
      where: { idEstado: idEstado },
      include: {
        estado: true,
      },
    });

    if (!dsn) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = dsn.map((dsn) => ({
      id: dsn.idDSN,
      usuario: dsn.usuario,
      mac: dsn.macAddress,
      dsn: dsn.dsn, 
      estado: dsn.estado.nombre,
      idEstado: dsn.idEstado,
    })); 

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

module.exports.create = async (request, response, next) => {
  try {
    const data = request.body;

    const newdsn = await prisma.dSN_Stick.create({
      data: {
        idEstado: 1,
        nombre: data.nombre || null,
        usuario: data.usuario,
        clave: data.clave,
        macAddress: data.macAddress || null,
        dsn: data.dsn || null,
      },
    });

    response.json(newdsn);

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

    const newdsn = await prisma.dSN_Stick.update({
        where: {idDSN: data.idDSN},
        data: {
          nombre: data.nombre || null,
          usuario: data.usuario,
          clave: data.clave,
          macAddress: data.macAddress || null,
          dsn: data.dsn || null,
        },
      });

    response.json(newdsn);
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
    let idDSN = parseInt(request.params.idDSN);

    await prisma.dSN_Stick.delete({
        where: {idDSN: idDSN},
    }); 

    response.status(200).json({
        message: `dsn eliminado con éxito.`
    });

  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reporte

module.exports.getDSNReport = async (request, response, next) => {
  try {
    const idDSN = parseInt(request.params.idDSN);

    let result = await prisma.$queryRaw(
      Prisma.sql`SELECT d.nombre, d.usuario, d.clave, d.macAddress, d.dsn, c.cloudMonitoreo AS monitoreo, 
                i.nombre AS nombreCliente, t.nombre as tipoCliente FROM dsn_stick d 
                JOIN iptv p ON d.idDSN = p.idDSN
                JOIN cliente c ON p.idCliente = c.idCliente 
                JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente 
                JOIN tipocliente t ON c.idTipo = t.idTipo 
                WHERE d.idDSN = ${idDSN};`
    );

    if (result.length === 0) {
      result = await prisma.$queryRaw(
        Prisma.sql`SELECT d.nombre, d.usuario, d.clave, d.macAddress, d.dsn FROM dsn_stick d WHERE d.idDSN = ${idDSN};`
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
      Prisma.sql`SELECT e.idEstado, e.nombre, d.nombre, d.usuario, d.clave, d.macAddress, d.dsn, i.nombre AS nombreCliente
                FROM dsn_stick d 
                LEFT JOIN iptv p ON d.idDSN = p.idDSN
                LEFT JOIN cliente c ON p.idCliente = c.idCliente 
                LEFT JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente 
                LEFT JOIN tipocliente t ON c.idTipo = t.idTipo
                LEFT JOIN estadoactivo e ON e.idEstado = d.idEstado;`
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
