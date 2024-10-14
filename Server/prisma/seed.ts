import { PrismaClient } from "@prisma/client";
import { estadoinstalacion } from "./seeds/estadoinstalacion";
import { estadocliente } from "./seeds/estadocliente";
import { estadoretiro } from "./seeds/estadoretiro";
import { estadoactivo } from "./seeds/estadoactivo";
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
 
  await prisma.estadoActivo.createMany({
    data: estadoactivo,
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
      "puertoNAT": "1",
    }
  });

  await prisma.oLT.create ({
    data: {
      "nombreTipo": "Primera OLT - P2",
      "ODF": 2,
      "segmentoZona": "P002",
      "ipGeneral": "10.120.12.0",
      "puertoNAT": "1",
    }
  });

  await prisma.oLT.create ({
    data: {
      "nombreTipo": "Primera OLT - P3",
      "ODF": 3,
      "segmentoZona": "P003",
      "ipGeneral": "10.120.13.0",
      "puertoNAT": "2",
    }
  });
 
  await prisma.router_Casa.createMany ({
    data: [
      {
          "idEstado": 1,
          "numActivo": "2896",
          "serie": "G1QPC1D143458",
          "macAddress": "02:00:00:fc:c9:35"
      },
      {
          "idEstado": 1,
          "numActivo": "2894",
          "serie": "G1QPC1D14333A",
          "macAddress": "02:00:00:e4:5e:25"
      },
      {
          "idEstado": 1,
          "numActivo": "2899",
          "serie": "G1QPC1D143555",
          "macAddress": "02:00:00:cb:1b:c0"
      },
      {
          "idEstado": 1,
          "numActivo": "3109",
          "serie": "G1QPC1D137152",
          "macAddress": "02:00:00:90:cc:41"
      },
      {
          "idEstado": 1,
          "numActivo": "2897",
          "serie": "G1QPC1D143576",
          "macAddress": "02:00:00:79:c1:c0"
      },
  ]
  });

  await prisma.oNT.createMany({
    data: [
      {
        "idEstado": 1,
        "numActivo": "ONT-123456",
        "macAddress": "00:1A:2B:3C:4D:5E",
        "numSN": "SN1234567890"
      },
      {  
        "idEstado": 1,
        "numActivo": "ONT-234567",
        "macAddress": "11:2B:3C:4D:5E:6F",
        "numSN": "SN0987654321"
   
      },
      {
        "idEstado": 1,
        "numActivo": "ONT-345678",
        "macAddress": "22:3C:4D:5E:6F:7G",
        "numSN": "SN1122334455"
      }, 
      {

        "idEstado": 1,
        "numActivo": "ONT-456789",
        "macAddress": "33:4D:5E:6F:7G:8H",
        "numSN": "SN2233445566"
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
