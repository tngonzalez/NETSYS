import { PrismaClient } from "@prisma/client";
import { estadoinstalacion } from "./seeds/estadoinstalacion";
import { estadoproyecto } from "./seeds/estadoproyecto";
import { estadoretiro } from "./seeds/estadoretiro";
import { estadorouter } from "./seeds/estadorouter";
import { tipoproyecto } from "./seeds/tipoproyecto";


const prisma = new PrismaClient();

async function main() {
  
  await prisma.estadoInstalacion.createMany({
    data: estadoinstalacion,
  });

  await prisma.estadoProyecto.createMany({
    data: estadoproyecto,
  });

  await prisma.estadoRetiro.createMany({
    data: estadoretiro,
  });
 
  await prisma.estadoRouter.createMany({
    data: estadorouter,
  });

   
  await prisma.tipoProyecto.createMany({
    data: tipoproyecto,
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
