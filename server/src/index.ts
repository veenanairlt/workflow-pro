import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";
const port = Number(process.env.PORT ?? 4000);
const server = app.listen(port, () => console.log(`API running on http://localhost:${port}`));
process.on("SIGINT", () => server.close(async () => { await prisma.$disconnect(); process.exit(0); }));
