# Natours Application

Built using modern technologies: node.js, express, mongoDB, mongoose and friends 😁

## 代码结构

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

## stripe 支付流程：

- 用户点击 “购买” **→** 后端调用 stripe.checkout.sessions.create → 生成支付页面 URL → 用户跳转支付。

- 用户支付成功 → Stripe 发送 checkout.session.completed 事件到你的 Webhook 地址。

- 后端接收事件 → 调用 stripe.webhooks.constructEvent 验证并解析 → 触发 “生成订单 order” 等业务逻辑。

## 应用工作逻辑：

### 用户访问 URL 流程 client -> server -> client：

-> 浏览器端输入访问 URL  
 -> routes/viewRoutes.js 视图层接收路由  
 -> controllers/viewsController.js 控制层接收 req 参数  
 -> models/tourModel.js 模型层获取/操作数据  
 -> controllers/viewsController.js 控制层渲染页面 template 和 json 数据  
 -> routes/viewRoutes.js 视图层响应页面和数据给 client  
 -> 浏览器渲染生成 UI

### 浏览器端用户触发事件流程，以用户登录操作为例：

-> 用户点击 login 按钮  
-> public/js/index.js 前端入口文件/获取 email&pwd/触发 login 事件  
-> public/js/login.js 调用后端 login 接口  
-> routes/userRoutes.js 路由层接收/api/v1/users/login 路由  
-> controllers/authController.js 控制层接收/校验 email&pwd  
-> models/userModel.js 模型层通过 Email 查询用户数据  
-> controllers/authController.js 控制层校验用户密码准确性/返回 token  
-> routes/userRoutes.js 路由层返回 token 给前端 login.js  
-> public/js/login.js 若登陆成功，弹窗提示 login success  
-> 浏览器端重新渲染并生成 UI
