import { PrismaClient } from "@prisma/client";
import { estadoinstalacion } from "./seeds/estadoinstalacion";
import { estadocliente } from "./seeds/estadocliente";
import { estadoretiro } from "./seeds/estadoretiro";
import { estadorouter } from "./seeds/estadorouter";
import { tipocliente } from "./seeds/tipocliente";
import { tipodano } from "./seeds/tipodano";
import { bw } from "./seeds/bw";


const prisma = new PrismaClient();

async function main() {
  
  await prisma.estadoInstalacion.createMany({
    data: estadoinstalacion,
  });

  await prisma.estadoCliente.createMany({
    data: estadocliente,
  });

  await prisma.estadoRetiro.createMany({
    data: estadoretiro,
  });
 
  await prisma.estadoRouter.createMany({
    data: estadorouter,
  });

  await prisma.tipoCliente.createMany({
    data: tipocliente,
  });

  await prisma.tipoDano.createMany({
    data: tipodano,
  });

  await prisma.bW.createMany({
    data: bw,
  });

  await prisma.oLT.create ({
    data: {
      "nombreTipo": "Primera OLT - P1",
      "ODF": 1,
      "segmentoZona": "P001",
      "ipGeneral": "10.120.11.0",
      "puertoNAT": "4",
    }
  });

  await prisma.oLT.create ({
    data: {
      "nombreTipo": "Primera OLT - P2",
      "ODF": 2,
      "segmentoZona": "P002",
      "ipGeneral": "10.120.12.0",
      "puertoNAT": "4",
    }
  });

  await prisma.oLT.create ({
    data: {
      "nombreTipo": "Primera OLT - P3",
      "ODF": 3,
      "segmentoZona": "P003",
      "ipGeneral": "10.120.13.0",
      "puertoNAT": "4",
    }
  });
 
  await prisma.router.createMany ({
    data: [
      {
          "idEstado": 1,
          "numActivo": "2896",
          "serie": "G1QPC1D143458",
          "macAddress": "02:00:00:fc:c9:35",
          "tipoDispositivo": "Router",
          "idOLT": null,
          "idSubred_OLT": null,
          "idZona_OLT": null

      },
      {
          "idEstado": 2,
          "numActivo": "2894",
          "serie": "G1QPC1D14333A",
          "macAddress": "02:00:00:e4:5e:25",
          "tipoDispositivo": "ONU",
          "idOLT": 1,
          "idSubred_OLT": null,
          "idZona_OLT": null
      },
      {
          "idEstado": 1,
          "numActivo": "2899",
          "serie": "G1QPC1D143555",
          "macAddress": "02:00:00:cb:1b:c0",
          "tipoDispositivo": "Router",
          "idOLT": null,
          "idSubred_OLT": null,
          "idZona_OLT": null
      },
      {
          "idEstado": 2,
          "numActivo": "3109",
          "serie": "G1QPC1D137152",
          "macAddress": "02:00:00:90:cc:41",
          "tipoDispositivo": "ONU",
          "idOLT": 2,
          "idSubred_OLT": null,
          "idZona_OLT": null
      },
      {
          "idEstado": 2,
          "numActivo": "2897",
          "serie": "G1QPC1D143576",
          "macAddress": "02:00:00:79:c1:c0",
          "tipoDispositivo": "Router",
          "idOLT": 3,
          "idSubred_OLT": null,
          "idZona_OLT": null
      },
  ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
