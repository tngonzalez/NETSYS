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
        Zona_OLT: true,
      },
    });

    const data = await Promise.all(
      dataOLT.map(async (o) => {
        const router = await prisma.router.findUnique({
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
        Zona_OLT: true,
      },
    });

    const datos = {
      idOLT: dataOLT.idOLT,
      ODF: dataOLT.ODF,
      nombreTipoOLT: dataOLT.nombreTipo,
      segmentoZona: dataOLT.segmentoZona,
      ipGeneral: dataOLT.ipGeneral,
      puertoNAT: dataOLT.puertoNAT,
      zonas: dataOLT.Zona_OLT.map((zona) => zona.nombreZona),
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
        nombreTipo: data.nombreTipo,
        ODF: data.ODF,
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
        idOLT: idOLT,
      },
      data: {
        nombreTipo: data.nombreTipo,
        ODF: parseInt(data.ODF),
        segmentoZona: data.segmentoZona,
        ipGeneral: data.ipGeneral,
        puertoNAT: data.puertoNAT,
      },
    });

    //  //New Zona - Array List
    // let createdZonas = [];
    // for(const nombre of data.zona) {

    //   const existingZona = await prisma.zona_OLT.findFirst({
    //     where: {
    //       nombreZona: nombre
    //     },
    //   });

    //   if(!existingZona) {

    //     const newZona = await prisma.zona_OLT.create({
    //       data:{
    //         idOLT:idOLT,
    //         nombreZona: nombre,
    //       },
    //     });

    //     createdZonas.push(newZona);
    //   } }

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

//Reporte
