const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const https = require('https');

dotenv.config({ path: './config.env' });
const app = require('./application');

// 异步连接函数
const connectDB = async () => {
  try {
    const DB = process.env.DATABASE.replace(
      '<PASSWORD>',
      process.env.DATABASE_PASSWORD
    );

    console.log('🔗 开始初始化 MongoDB 连接');
    await mongoose.connect(DB, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferTimeoutMS: 3000,
      keepAliveInitialDelay: 300000,
    });
    console.log('🎉 MongoDB 连接成功');
  } catch (e) {
    console.error('❌ MongoDB 连接失败:', e.message);
    throw e; // 传播错误，阻止服务器启动
  }
};

function getServer() {
  const port = process.env.PORT || 3000;
  if (process.env.NODE_ENV === 'development') {
    // 读取自签名证书
    const privateKey = fs.readFileSync(
      'D:/remote-job/mkcert/127.0.0.1-key.pem',
      'utf8'
    );
    const certificate = fs.readFileSync(
      'D:/remote-job/mkcert/127.0.0.1.pem',
      'utf8'
    );
    const credentials = { key: privateKey, cert: certificate };

    // 设置 HTTPS 服务器
    return https.createServer(credentials, app).listen(port, () => {
      console.log(`test env, App running on port ${port}...`);
    });
  } else {
    return app.listen(port, () => {
      console.log(`prod env, App running on port ${port}...`);
    });
  }
}

// 错误处理
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// 主流程：先连接数据库，再启动服务器
const startServer = async () => {
  try {
    await connectDB(); // 等待数据库连接成功

    const server = getServer();

    process.on('unhandledRejection', (err) => {
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
  } catch (err) {
    console.error('💥 启动失败，退出进程');
    process.exit(1);
  }
};

// 启动应用
startServer();
