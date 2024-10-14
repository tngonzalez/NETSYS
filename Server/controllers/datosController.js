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
  const proyecto = await prisma.estadoCliente.findMany({
    orderBy: {
      idEstado: "asc",
    },
  });
  response.json(proyecto);
};

//Estado Retiro 

//Get
module.exports.getEstRetiro = async (request, response, next) => {
  const retiro = await prisma.estadoRetiro.findMany({
    orderBy: {
      idEstado: "asc",
    },
  });
  response.json(retiro);
};

//Estado Activo 

//Get
module.exports.getEstActivo = async (request, response, next) => {
  const activo = await prisma.estadoActivo.findMany({
    orderBy: {
      idEstado: "asc",
    },
  });
  response.json(activo);
};

//Tipo Proyecto

//Get
module.exports.getTipoProyecto = async (request, response, next) => {
  const tipo = await prisma.tipoCliente.findMany({
    orderBy: {
      idTipoProyecto: "asc",
    },
  });
  response.json(tipo);
};
