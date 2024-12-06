const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//Get All
module.exports.get = async (request, response, next) => {
  try {
    const dataOLT = await prisma.oLT.findMany({
      orderBy: {
        idOLT: "asc",
      },
      include: {
        Subred_OLT: true,
      },
    });

    const data = await Promise.all(
      dataOLT.map(async (o) => {
        const router = await prisma.router_Gestor.findFirst({
          where: { idOLT: o.idOLT },
        });

        const existeRouter = router ? true : false;

        return {
          idOLT: o.idOLT,
          ODF: o.ODF,
          nombreTipoOLT: o.nombreTipo,
          segmentoZona: o.segmentoZona,
          ipGeneral: o.ipGeneral,
          puertoNAT: o.puertoNAT,
          combo: o.nombreTipo + " - " + o.ipGeneral, 
          existeRouter,
        };
      })
    );

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getOLTById = async (request, response, next) => {
  try {
    let idOLT = parseInt(request.params.idOLT);

    const dataOLT = await prisma.oLT.findUnique({
      where: { idOLT: idOLT },
      include: {
        Subred_OLT: true,
      },
    });

    const datos = {
      idOLT: dataOLT.idOLT,
      ODF: dataOLT.ODF,
      numOLT: dataOLT.numOLT,
      nombreTipoOLT: dataOLT.nombreTipo,
      segmentoZona: dataOLT.segmentoZona,
      ipGeneral: dataOLT.ipGeneral,
      puertoNAT: dataOLT.puertoNAT,
      subredes: dataOLT.Subred_OLT.map((subred) => subred.ip),
    };
    response.json(datos);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Delete
module.exports.deteleOLT = async (request, response, next) => {
  let idOLT = parseInt(request.params.idOLT);
  try {
    await prisma.oLT.delete({
      where: {
        idOLT: idOLT,
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
    const data = request.body;

    const newOLT = await prisma.oLT.create({
      data: {
        numOLT: data.numOLT,
        nombreTipo: data.nombreTipo,
        ODF: data.ODF,
        numOLT: data.numOLT,
        segmentoZona: data.segmentoZona,
        ipGeneral: data.ipGeneral,
        puertoNAT: data.puertoNAT,
      },
    });

    response.json({
      olt: newOLT,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya existe. Por favor, intente con otro OLT`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update
module.exports.update = async (request, response, next) => {
  try {
    let idOLT = parseInt(request.params.idOLT);
    const data = request.body;

    const newOLT = await prisma.oLT.update({
      where: {
        idOLT: data.idOLT,
      },
      data: {
        nombreTipo: data.nombreTipo,
        ODF: parseInt(data.ODF),
        numOLT: data.numOLT,
        segmentoZona: data.segmentoZona,
        puertoNAT: data.puertoNAT,
      },
    });

    response.json({
      olt: newOLT,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return response.status(400).json({
        message: `La información ingresada ya está en uso. Por favor, ingrese valores único.`,
      });
    }

    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Select Subred By IdOLT 
module.exports.getSubrededByIdOLT = async (request, response, next) => {
  try {
    const idOLT = parseInt(request.params.idOLT);

    const olt = await prisma.oLT.findUnique({
      where: { idOLT: idOLT },
    });

    if (!olt) {
      return response.status(404).json({ message: "OLT no encontrado" });
    }

    const ipGeneral = olt.ipGeneral.split('.').slice(0, 3).join('.');

    //Subredes Existentes
    const subredesExistentes = await prisma.subred_OLT.findMany({
      where: {
        idOLT: idOLT,
        ip: {
          startsWith: ipGeneral,
        },
      },
    });

    //Extre  el ultimo segmento de la IP
    const ipsUsadas = subredesExistentes.map((subred) => {
      return parseInt(subred.ip.split('.')[3]); 
    });

    // Generar una lista de las disponibles y excluyendo las asignadas
    const subredesDisponibles = [];
    for (let i = 50; i <= 254; i++) {
      if (!ipsUsadas.includes(i)) {
        subredesDisponibles.push(`${ipGeneral}.${i}`);
      }
    }

    //Ordena subred: menor a mayor
    subredesDisponibles.sort((a, b) => {
      return parseInt(a.split('.')[3]) - parseInt(b.split('.')[3]);
    });

    //Selecciona las primeras 5 IPs
    const subredesSeleccionadas = subredesDisponibles.slice(0, 5);

    response.json({
      subredesDisponibles: subredesSeleccionadas,
    });
    
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Reportes 

module.exports.getOLTReport =  async (request, response, next) => {
  try {
    const idOLT = parseInt(request.params.idOLT);

    let result = await prisma.$queryRaw(
      Prisma.sql `SELECT o.nombreTipo, o.ODF, o.segmentoZona, o.ipGeneral, o.puertoNAT, i.nombre AS clienteNombre, c.cloudMonitoreo, s.ip AS subredIP FROM olt o JOIN  router_gestor r ON o.idOLT = r.idOLT JOIN subred_olt s ON r.idSubred_OLT = s.idRed JOIN cliente c ON r.idRouter_Gestor = c.idRouter_Gestor JOIN infocliente i ON c.idInfoCliente = i.idInfoCliente WHERE o.idOLT = ${idOLT} ORDER BY s.ip ASC;`
    );

    if(result.length === 0) {
       result = await prisma.$queryRaw(
        Prisma.sql `SELECT o.nombreTipo, o.ODF, o.segmentoZona, o.ipGeneral, o.puertoNAT FROM olt o WHERE o.idOLT = ${idOLT} ;`
      );
    }

    response.json(result);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
}

module.exports.getGeneralReport =  async (request, response, next) => {
  try {

    const result = await prisma.$queryRaw(
      Prisma.sql `SELECT o.nombreTipo, o.ODF, o.segmentoZona, o.ipGeneral, o.puertoNAT, COUNT(s.idOLT) AS cantIP FROM olt o LEFT JOIN subred_olt s ON s.idOLT = o.idOLT GROUP BY o.idOLT, o.nombreTipo, o.ODF, o.segmentoZona, o.ipGeneral, o.puertoNAT ;`
    );

    const conversion_BigInt_String = result.map(item => {
      const data = { ...item };
      Object.keys(data).forEach(key => {
        if (typeof data[key] === 'bigint') {
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
}


