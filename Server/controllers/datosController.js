const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

//Estado Instalación 

//Get
module.exports.getEstInstalacion = async (request, response, next) => {
  const instalacion = await prisma.estadoInstalacion.findMany({
    orderBy: {
      idEstInstalacion: "asc",
    },
  });
  response.json(instalacion);
};

//Estado Proyecto

//Get
module.exports.getEstProyecto = async (request, response, next) => {
  const proyecto = await prisma.estadoProyecto.findMany({
    orderBy: {
      idEstProyecto: "asc",
    },
  });
  response.json(proyecto);
};

//Estado Retiro 

//Get
module.exports.getEstRetiro = async (request, response, next) => {
  const retiro = await prisma.estadoRetiro.findMany({
    orderBy: {
      idEstRetiro: "asc",
    },
  });
  response.json(retiro);
};

//Estado Router 

//Get
module.exports.getEstRouter = async (request, response, next) => {
  const router = await prisma.estadoRouter.findMany({
    orderBy: {
      idEstRouter: "asc",
    },
  });
  response.json(router);
};

//Tipo Proyecto

//Get
module.exports.getTipoProyecto = async (request, response, next) => {
  const tipo = await prisma.tipoProyecto.findMany({
    orderBy: {
      idTipoProyecto: "asc",
    },
  });
  response.json(tipo);
};