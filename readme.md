# Natours Application

Built using modern technologies: node.js, express, mongoDB, mongoose and friends 😁

|---controllers # 控制层，负责请求参数校验、响应参数 header/body 处理、业务逻辑调用
|---dev-data # 开发环境所需数据
|---models # 模型层，负责与数据库打交道，字段校验、查询中间件数据处理
|---public # 前端静态资源：js/css/img/html 以及 parcel 编译打包 output
|------js/index.js # 项目前端入口文件
|---routes # 路由层，负责连接 URL 和请求方式（get/post/patch/delete）、控制层
|---utils # 公共方法，提供异常/错误处理、异步函数、Email
|---views # 视图层，用来展示前端页面，主要使用 pug
|---.eslintrc.json # ESLint（一个用于识别和报告 JavaScript 代码中模式问题的工具）的核心配置文件，用于定义代码检查规则、解析器选项、环境配置等，确保项目代码风格一致、避免潜在错误
|---.gitignore # 避免 git push 一些大文件、敏感文件
|---.prettierrc # 用于定义代码的格式化规则（如缩进、换行、引号样式等），实现代码风格的自动化统一，避免人工格式化的繁琐和不一致
|---application.js # 应用启动文件，负责初始化 express 框架，如跨域、限速器、安全攻击防御等
|---config.env # mongodb、email、mapbox 敏感配置信息
|---package.json # 第三方依赖 modules、前后端打包部署命令
|---server.js # 项目后端入口文件、启动命令文件

stripe 支付流程：
1、用户点击 “购买”→ 后端调用 stripe.checkout.sessions.create → 生成支付页面 URL → 用户跳转支付。
2、用户支付成功 → Stripe 发送 checkout.session.completed 事件到你的 Webhook 地址。
3、后端接收事件 → 调用 stripe.webhooks.constructEvent 验证并解析 → 触发 “发货” 等业务逻辑。
