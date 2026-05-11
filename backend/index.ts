import express from "express";
import { server, app } from "@/serverConfig";
import { pool } from "@middlewares/database";
import { globalErrorHandler } from "@middlewares/globalErrorHandler";
import { AppError } from "@middlewares/AppError";
import todoController from "@/controller/_controler";

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/todos", todoController);

export { app };


// Route không khớp → 404
app.use((req, _res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Catch lỗi toàn cục
app.use(globalErrorHandler);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Graceful shutdown
async function gracefulShutdown(signal: string) {
  console.log(`\n[${signal}] Shutting down gracefully...`);

  server.close(async () => {
    console.log('HTTP server closed.');

    try {
      await pool.end();
      console.log('PostgreSQL pool closed.');
      process.exit(0);
    } catch (err) {
      console.error('Error during shutdown:', err);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Khởi động server
server.listen(Number(process.env.PORT) || 3000, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${Number(process.env.PORT) || 3000}`);
});