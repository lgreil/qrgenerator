import { createTRPCRouter } from "~/server/api/trpc";
import { qrcodeRouter } from "./routers/qrcode";

export const appRouter = createTRPCRouter({
  qrcode: qrcodeRouter,
});

export type AppRouter = typeof appRouter; 