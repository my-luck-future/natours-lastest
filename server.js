const mongoose = require('mongoose');
const dotenv = require('dotenv');

console.info('------enter pro-------');
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// dotenv.config({ path: './config.env' });
const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

try {
  console.log('🔗 开始初始化 MongoDB 连接');
  mongoose.connect(DB, {
    maxPoolSize: 1, // 减少连接池大小（Serverless 不适合大连接池）
    serverSelectionTimeoutMS: 5000, // 缩短服务器选择超时（5秒）
    socketTimeoutMS: 45000, // 延长 socket 超时（避免频繁断开）
    // keepAlive: true, // 保持连接
    bufferTimeoutMS: 3000,
    keepAliveInitialDelay: 300000 // 5分钟发送一次心跳包
  });
  console.log('🎉 MongoDB 连接成功');
  // .then(() => console.log('DB connection successful!'));
} catch (e) {
  console.error('❌ MongoDB 连接失败:', e.message);
  throw err; // 抛出错误，供后续请求捕获
}
