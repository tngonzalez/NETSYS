const { PrismaClient, Prisma } = require("@prisma/client");
const { response } = require("express");
const prisma = new PrismaClient();

//Get All
module.exports.getFTTH = async (request, response, next) => {
  try {
    const fttch = await prisma.proyecto.findMany({
      orderBy: {
        idProyecto: "asc",
      },
      include: {
        tipoProyecto: true,
        ont: true,
        estadoProyecto: true,
        router: true,
        subredes: true,
        condominio: true,
        consecutivo: true,
        direccionamiento: true,
      },
    });

    const data = fttch.map((r) => ({
      fecha: r.fecInstalacion,
      proyecto: r.tipoProyecto.nombre,
      cliente: r.nombreCliente,
      agente: r.agente,
    }));

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Id
module.exports.getFTTHById = async (request, response, next) => {
  try {
    let idProyecto = parseInt(request.params.idProyecto);

    const fttch = await prisma.proyecto.findUnique({
      where: { idProyecto: idProyecto },
      include: {
        tipoProyecto: true,
        ont: true,
        estadoProyecto: true,
        router: true,
        subredes: true,
        condominio: true,
        consecutivo: true,
        direccionamiento: true,
      },
    });

    if (fttch.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }
    //Mas adelante mostrar el historial: Retiros + Suspenciones + Dañandos
    //Toda la info.

    const data = {
      fecha: r.fecInstalacion,
      proyecto: r.tipoProyecto.nombre,
      cliente: r.nombreCliente,
      agente: r.agente,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};
//Get By Tipo Proyecto
module.exports.getFTTHByIdTipo = async (request, response, next) => {
  try {
    let idTipo = parseInt(request.params.idTipo);

    const fttch = await prisma.proyecto.findMany({
      where: { idTipoProyecto: idTipo },
      include: {
        tipoProyecto: true,
        ont: true,
        estadoProyecto: true,
        router: true,
        subredes: true,
        condominio: true,
        consecutivo: true,
        direccionamiento: true,
      },
    });

    if (fttch.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      fecha: r.fecInstalacion,
      proyecto: r.tipoProyecto.nombre,
      cliente: r.nombreCliente,
      agente: r.agente,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Get By Estado
module.exports.getFTTHByIdEstado = async (request, response, next) => {
  try {
    let idEstado = parseInt(request.params.idEstado);

    const fttch = await prisma.proyecto.findMany({
      where: { idEstProyecto: idEstado },
      include: {
        tipoProyecto: true,
        ont: true,
        estadoProyecto: true,
        router: true,
        subredes: true,
        condominio: true,
        consecutivo: true,
        direccionamiento: true,
      },
    });

    if (fttch.length === 0) {
      return response.status(404).json({
        message: "Error en la solicitud",
      });
    }

    const data = {
      fecha: r.fecInstalacion,
      proyecto: r.tipoProyecto.nombre,
      cliente: r.nombreCliente,
      agente: r.agente,
    };

    response.json(data);
  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Crear
module.exports.create = async (request, response, next) => {
  try {
    const data = request.body;
    //Analizar nuevamente el OLT: Si no existe con esa zona dará error
    //Y no dará valores
    //OLT
    const OLT = await prisma.oLT.findUnique({
      where: {
        idTipo_OLT: data.idTipoOLT,
        zona: data.zonaOLT,
      },
      include: {
        tipoOLT: true,
        subredes: true,
      },
    });

    //En caso de que no encuentre OLT con esa zona
    if (OLT.length === 0) {
      const createOLT = await prisma.oLT.create({
        data: {
          idTipo_OLT: OLT.idTipo_OLT,
          num_OLT: OLT.num_OLT,
          ODF: OLT.ODF,
          segmentoZona: OLT.segmentoZona,
          zona: data.zona,
          ipGeneral: OLT.ipGeneral,
        },
      });
    }

    //ONT
    const ONT = await prisma.oNT.create({
      data: {
        potenciaRecepcion: data,
        potenciaRecepcion,
        numActivo: data.numActivo,
        macAddress: data.macAddressONT,
        numSN: data.numSN,
      },
    });

    const newFTTCH = await prisma.proyecto.create({
      data: {
        idTipoProyecto: data.idTipoProyecto,
        idONT: ONT.idONT,
        numCliente: data.numCliente,
        nombreCliente: data.nombreCliente,
        plan: data.plan,
        numOS: data.numOS,
        puertoNAT: data.puertoNAT,
        cajaDerivada: data.cajaDerivada,
        idEstProyecto: data.idEstProyecto,
        BW: data.BW,
        BW_KBPS: data.BW_KBPS,
        idRouter: data.idRouter,
        comentario: data.comentario,
        fecInstalacion: data.fecInstalacion,
        agente: data.agente,
      },
    });

    //Validación Condominio o Consecutivo
    if (data.condominio !== null) {
      const condominio = await prisma.condominio.create({
        data: {
            idProyecto: newFTTCH.idProyecto,
            zona: data.zonaCondominio,
            numCasa: data.numCasa,
            cloudMonitoreo: data.cloudMonitoreo,
        },
      });  
    }

    if (data.consecutivo !== null) {
        const consecutivo = await prisma.consecutivo.create({
            data: {
                idProyecto: newFTTCH.idProyecto,
                numero: data.numeroConsecutivo,
                cloudMonitoreo: data.cloudMonitoreo,
            }
        })
    }

    //Subredes: Buscar por idTipoOLT cual ip están disponibles.

    const subredes = await prisma.subredes_OLT.create({
      data: {
        idProyecto: newFTTCH.idProyecto,
        idOLT: OLT.idOLT,
        ip: null,
      },
    });

    response.json(data);

  } catch (error) {
    response.status(500).json({ message: "Error en la solicitud", error });
  }
};

//Update

//Delete

//Reporte
