# 买量小飞机 - 一站式智能投放工具

买量小飞机是一个复刻项目，参考 [买量小飞机官网](https://www.smallfighter.cn/cidProduct.html) 实现的一站式智能投放工具。本项目采用前后端分离架构，使用 Vue.js 3 + Egg.js + MongoDB 技术栈开发。

## 🎯 项目功能

- **用户管理**：用户注册、登录、个人信息管理
- **广告账户管理**：多平台账户接入（抖音、快手、微信、微博、知乎等）、授权管理
- **广告计划管理**：计划创建、编辑、批量操作、状态管理
- **广告创意管理**：素材上传、创意管理、A/B 测试
- **数据统计分析**：实时监控、报表生成、可视化大屏

## 🛠 技术栈

### 前端
- Vue.js 3 + Composition API
- Vue Router 4（路由管理）
- Pinia（状态管理）
- Element Plus（UI 组件库）
- Axios（HTTP 请求）
- ECharts（数据可视化）

### 后端
- Egg.js（Node.js 企业级框架）
- MongoDB + Mongoose（数据库和 ODM）
- JWT（身份认证）
- bcryptjs（密码加密）

## 📁 项目结构

```
project_code_cursor/
├── backend/                 # 后端项目
│   ├── app/
│   │   ├── controller/     # 控制器
│   │   ├── model/          # 数据模型
│   │   ├── middleware/     # 中间件
│   │   └── router.js       # 路由配置
│   ├── config/             # 配置文件
│   └── package.json
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── api/            # API 接口
│   │   ├── assets/         # 静态资源
│   │   ├── components/     # 公共组件
│   │   ├── router/          # 路由配置
│   │   ├── store/           # 状态管理
│   │   └── views/           # 页面组件
│   └── package.json
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm 或 yarn

### 1. 安装依赖

#### 后端依赖安装

```bash
cd backend
npm install
```

#### 前端依赖安装

```bash
cd frontend
npm install
```

### 2. 配置环境

#### 后端配置

编辑 `backend/config/config.default.js`，配置 MongoDB 连接：

```javascript
config.mongoose = {
  url: process.env.MONGODB_URI || 'mongodb://localhost:27017/ad_buying_plane',
  // ...
};
```

或使用环境变量：

```bash
# Windows
set MONGODB_URI=mongodb://localhost:27017/ad_buying_plane
set JWT_SECRET=your-secret-key
set CRYPTO_SECRET=your-crypto-secret-key

# Linux/Mac
export MONGODB_URI=mongodb://localhost:27017/ad_buying_plane
export JWT_SECRET=your-secret-key
export CRYPTO_SECRET=your-crypto-secret-key
```

#### 前端配置

编辑 `frontend/vue.config.js`，确保代理配置正确：

```javascript
devServer: {
  port: 8080,
  proxy: {
    '/api': {
      target: 'http://localhost:7001',
      changeOrigin: true,
    },
  },
},
```

### 3. 启动 MongoDB

确保 MongoDB 服务已启动：

```bash
# Windows (如果 MongoDB 已安装为服务，会自动启动)
# 或手动启动
mongod

# Linux/Mac
sudo systemctl start mongod
# 或
mongod
```

### 4. 启动后端服务

```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:7001` 启动。

### 5. 启动前端服务

```bash
cd frontend
npm run serve
```

前端服务将在 `http://localhost:8080` 启动。

### 6. 访问应用

打开浏览器访问：`http://localhost:8080`

## 📝 API 接口说明

### 统一响应格式

所有接口返回统一格式：

```json
{
  "code": 200,
  "message": "操作成功",
  "data": {
    // 具体数据
  }
}
```

### 主要接口

#### 用户相关
- `POST /api/user/register` - 用户注册
- `POST /api/user/login` - 用户登录
- `GET /api/user/info` - 获取用户信息（需要 Token）
- `PUT /api/user/info` - 更新用户信息（需要 Token）
- `PUT /api/user/password` - 修改密码（需要 Token）

#### 广告账户相关
- `POST /api/ad-account` - 创建广告账户（需要 Token）
- `GET /api/ad-account` - 获取账户列表（需要 Token）
- `GET /api/ad-account/:id` - 获取账户详情（需要 Token）
- `PUT /api/ad-account/:id` - 更新账户（需要 Token）
- `DELETE /api/ad-account/:id` - 删除账户（需要 Token）
- `POST /api/ad-account/:id/sync` - 同步账户信息（需要 Token）

#### 广告计划相关
- `POST /api/ad-plan` - 创建广告计划（需要 Token）
- `GET /api/ad-plan` - 获取计划列表（需要 Token）
- `POST /api/ad-plan/batch/status` - 批量更新状态（需要 Token）
- `POST /api/ad-plan/batch/delete` - 批量删除（需要 Token）

#### 广告创意相关
- `POST /api/ad-creative/upload` - 文件上传（需要 Token）
- `POST /api/ad-creative` - 创建创意（需要 Token）
- `GET /api/ad-creative` - 获取创意列表（需要 Token）

#### 统计数据相关
- `GET /api/statistics` - 获取统计数据（需要 Token）

## 🔐 认证说明

大部分接口需要 JWT Token 认证。在请求头中添加：

```
Authorization: Bearer YOUR_TOKEN
```

登录成功后，Token 会自动存储在 localStorage 中，前端请求会自动携带。

## 🗄 数据库说明

### 主要数据表

- `users` - 用户表
- `ad_accounts` - 广告账户表
- `ad_plans` - 广告计划表
- `ad_creatives` - 广告创意表
- `statistics` - 数据统计表

### 索引

所有表都已创建必要的索引，确保查询性能。

## 🧪 测试

### 后端测试

```bash
cd backend
npm test
```

### 前端测试

```bash
cd frontend
npm run lint
```

## 📦 生产环境部署

### 后端部署

```bash
cd backend
npm start
```

### 前端构建

```bash
cd frontend
npm run build
```

构建后的文件在 `frontend/dist` 目录，可以部署到 Nginx 或其他静态文件服务器。

## 🐛 常见问题

### 1. MongoDB 连接失败

- 检查 MongoDB 服务是否启动
- 检查连接字符串是否正确
- 检查 MongoDB 端口是否被占用

### 2. 前端无法访问后端接口

- 检查后端服务是否启动（默认端口 7001）
- 检查 `vue.config.js` 中的代理配置
- 检查 CORS 配置

### 3. Token 认证失败

- 检查 Token 是否过期（默认 7 天）
- 检查请求头是否正确添加 Authorization
- 检查 JWT_SECRET 配置是否正确

## 📚 开发文档

详细的开发文档请参考：

- [项目总览](./.cursor/rules/00_master_plan.mdc)
- [基础设施搭建](./.cursor/rules/01_infrastructure.mdc)
- [用户管理模块](./.cursor/rules/02_user_module.mdc)
- [广告账户模块](./.cursor/rules/03_account_module.mdc)
- [广告计划模块](./.cursor/rules/04_plan_module.mdc)
- [广告创意模块](./.cursor/rules/05_creative_module.mdc)
- [数据统计模块](./.cursor/rules/06_statistics_module.mdc)
- [部署指南](./.cursor/rules/07_deployment.mdc)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👥 作者

买量小飞机复刻项目

---

**注意**：本项目为复刻项目，仅用于学习和研究目的。
