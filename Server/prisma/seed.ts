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

  await prisma.usuario.create ({
    data: {
      "tipoRol": 1, //1 = Support L1, 2 = Support L2 
      "nombre": "Technical Support",
      "apellidos": "REICO",
      "correo": "support1@reico.cr",
      "clave": "reico123"
    }
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
