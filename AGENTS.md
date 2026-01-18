# 买量小飞机复刻项目 - 开发向导

本文档是**买量小飞机**网页应用复刻项目的入口指南。本项目已被拆分为多个模块化的 Prompt 文件，以便分步骤、清晰地完成开发任务。

## 📁 Prompt 目录结构

所有的 Prompt 文件都存放在 `.cursor/rulse/` 目录下：

1.  [**00_master_plan.md**](.cursor/rulse/00_master_plan.md)
    *   **内容**：项目背景、整体架构、技术栈选择。
    *   **用途**：了解项目全局，确认开发方向。

2.  [**01_infrastructure.mdc**](.cursor/rulse/01_infrastructure.mdc)
    *   **内容**：前后端项目初始化、基础配置、目录结构、公共组件。
    *   **用途**：搭建项目骨架，跑通前后端基础环境。

3.  [**02_user_module.mdc**](.cursor/rulse/02_user_module.mdc)
    *   **内容**：用户注册、登录、个人信息管理、系统设置。
    *   **用途**：实现核心的用户认证和权限体系。

4.  [**03_account_module.mdc**](.cursor/rulse/03_account_module.mdc)
    *   **内容**：广告账户的接入、列表展示、授权管理。
    *   **用途**：实现多平台广告账户的连接功能。

5.  [**04_plan_module.mdc**](.cursor/rulse/04_plan_module.mdc)
    *   **内容**：广告计划的创建、编辑、状态管理。
    *   **用途**：实现广告投放的核心业务逻辑。

6.  [**05_creative_module.mdc**](.cursor/rulse/05_creative_module.mdc)
    *   **内容**：广告创意的上传、管理、A/B 测试。
    *   **用途**：实现素材管理和创意优化功能。

7.  [**06_statistics_module.mdc**](.cursor/rulse/06_statistics_module.mdc)
    *   **内容**：数据统计分析、仪表盘可视化、智能优化建议。
    *   **用途**：实现数据报表和可视化大屏。

8.  [**07_deployment.mdc**](.cursor/rulse/07_deployment.mdc)
    *   **内容**：服务器环境准备、Nginx 配置、PM2 部署。
    *   **用途**：项目上线部署指南。

## 🚀 如何使用

建议按照以下顺序进行开发：

1.  **阅读全局规划**：首先阅读 `00_master_plan.md`，理解项目目标。
2.  **按序执行**：从 `01_infrastructure.md` 开始，将每个文件的内容作为 Prompt 输入给 AI 助手，或者根据文件内容手动编写代码。
3.  **模块化开发**：每个模块都包含了数据库设计、后端 API 实现和前端页面实现，确保该模块功能闭环后再进入下一个模块。

---
