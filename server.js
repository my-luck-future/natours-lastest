const mongoose = require('mongoose');
// const dotenv = require('dotenv');

process.stdout.write('------enter pro-------');
process.on('uncaughtException', err => {
  process.stdout.write('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  process.stdout.write(err.name, err.message);
  process.exit(1);
});

// dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
// const server = app.listen(port, () => {
//   process.stdout.write(`App running on port ${port}...`);
// });

process.on('unhandledRejection', err => {
  process.stdout.write('UNHANDLED REJECTION! 💥 Shutting down...');
  process.stdout.write(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  process.stdout.write('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    process.stdout.write('💥 Process terminated!');
  });
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

process.stdout.write('🔗 开始初始化 MongoDB 连接');
mongoose
  .connect(DB, {
    maxPoolSize: 1, // 减少连接池大小（Serverless 不适合大连接池）
    serverSelectionTimeoutMS: 5000, // 缩短服务器选择超时（5秒）
    socketTimeoutMS: 45000, // 延长 socket 超时（避免频繁断开）
    // keepAlive: true, // 保持连接
    bufferTimeoutMS: 3000,
    keepAliveInitialDelay: 300000 // 5分钟发送一次心跳包
  })
  .then(() => {
    process.stdout.write('🎉 MongoDB 连接成功');
    // 连接成功后再启动服务器
    server = app.listen(port, () => {
      process.stdout.write(`App running on port ${port}...`);
    });
  })
  .catch(err => {
    process.stdout.write('❌ MongoDB 连接失败:', err);
    process.exit(1);
  });
