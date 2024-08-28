const { PrismaClient, Prisma } = require("@prisma/client");
const { request, response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getRouter = async (request, response, next) => {
  try {
    const router = await prisma.router.findMany({
        orderBy: {
          idRouter: "asc",
        },
        include: {
            estadoRouter: true,
            proyecto: true,
        }
      });

      const data = router.map((r) => ({
        id: r.idRouter,
        idEstado: r.idEstRouter,
        estado: r.estadoRouter.nombre,
        activo: r.numActivo,
        serie: r.serie, 
        macAddress: r.macAddress,
      })); 
      response.json(data);

  } catch (error) {
        response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//GetById
module.exports.getRouterById = async (request, response, next) => {
    try {
        let idRouter = parseInt(request.params.idRouter); 
        const router = await prisma.router.findUnique({
          where: {
            idRouter: idRouter,
          },
          include: {
            estadoRouter: true,
            proyecto: true,
        }
        });
    
        const data = {
            id: router.idRouter,
            idEstado: router.idEstRouter,
            estado: router.estadoRouter.nombre,
            activo: router.numActivo,
            serie: router.serie, 
            macAddress: router.macAddress,
        }
        response.json(data);
    } catch (error) {
        response.status(500).json({ message: "Error en la solicitud", error });  
    }
};

//GetByEstado 
module.exports.getRouterByEstado = async (request, response, next) => {
    try {
        let idEstado = parseInt(request.params.idEstado); 
        const router = await prisma.router.findUnique({
          where: {
            idEstRouter: idEstado,
          },
          include: {
            estadoRouter: true,
            proyecto: true,
        }
        });
    
        const data = {
            id: router.idRouter,
            idEstado: router.idEstRouter,
            estado: router.estadoRouter.nombre,
            activo: router.numActivo,
            serie: router.serie, 
            macAddress: router.macAddress,
        }
        response.json(data);
    } catch (error) {
        response.status(500).json({ message: "Error en la solicitud", error });  
    }
};

//Delete
module.exports.deteleRouter = async( request, response, next) => {
    let idRouter = parseInt(request.params.idRouter); 
    try {
        await prisma.router.delete({
            where: {
                idRouter: idRouter,
            }
        });
        response.json("Eliminación exitosa"); 
        
    } catch (error) {
        response.status(500).json({ message: "Error en la solicitud", error });  
    }

}

//Create: Scanner
//Update 
//Reporte