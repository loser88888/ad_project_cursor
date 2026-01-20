'use strict';

const Controller = require('egg').Controller;

class AdAccountController extends Controller {
  // 创建广告账户
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const {
      platform,
      accountName,
      accountId,
      accessToken,
      refreshToken,
      expiresIn,
    } = ctx.request.body;

    // 验证参数
    ctx.validate({
      platform: { type: 'string', required: true },
      accountName: { type: 'string', required: true },
      accountId: { type: 'string', required: true },
      accessToken: { type: 'string', required: true },
      refreshToken: { type: 'string', required: true },
      expiresIn: { type: 'number', required: true },
    });

    // 检查账户是否已存在
    const existingAccount = await ctx.model.AdAccount.findOne({
      platform,
      accountId,
      userId,
    });
    if (existingAccount) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '该账户已存在',
        data: null,
      };
      return;
    }

    // 计算Token过期时间
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    // 创建账户
    const adAccount = new ctx.model.AdAccount({
      userId,
      platform,
      accountName,
      accountId,
      accessToken,
      refreshToken,
      expiresIn,
      tokenExpiresAt,
      status: 'active',
    });
    await adAccount.save();

    ctx.status = 201;
    ctx.body = {
      code: 201,
      message: '广告账户创建成功',
      data: {
        id: adAccount._id,
        platform: adAccount.platform,
        accountName: adAccount.accountName,
        accountId: adAccount.accountId,
        status: adAccount.status,
        balance: adAccount.balance,
        createdAt: adAccount.createdAt,
      },
    };
  }

  // 获取广告账户列表
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { page = 1, pageSize = 10, platform, status } = ctx.query;

    // 构建查询条件
    const query = { userId };
    if (platform) query.platform = platform;
    if (status) query.status = status;

    // 分页查询
    const total = await ctx.model.AdAccount.countDocuments(query);
    const accounts = await ctx.model.AdAccount.find(query)
      .select('-accessToken -refreshToken') // 不返回敏感信息
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 });

    ctx.body = {
      code: 200,
      message: '获取广告账户列表成功',
      data: {
        list: accounts,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          pages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  // 获取广告账户详情
  async detail() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const account = await ctx.model.AdAccount.findOne({
      _id: id,
      userId,
    }).select('-accessToken -refreshToken');

    if (!account) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告账户不存在',
        data: null,
      };
      return;
    }

    ctx.body = {
      code: 200,
      message: '获取广告账户详情成功',
      data: account,
    };
  }

  // 更新广告账户
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;
    const { accountName, accessToken, refreshToken, expiresIn } = ctx.request.body;

    ctx.validate({
      accountName: { type: 'string', required: false },
      accessToken: { type: 'string', required: false },
      refreshToken: { type: 'string', required: false },
      expiresIn: { type: 'number', required: false },
    });

    const account = await ctx.model.AdAccount.findOne({
      _id: id,
      userId,
    });

    if (!account) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告账户不存在',
        data: null,
      };
      return;
    }

    // 更新字段
    if (accountName) account.accountName = accountName;
    if (accessToken) {
      account.accessToken = accessToken;
      account.refreshToken = refreshToken;
      account.expiresIn = expiresIn;
      account.tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
      account.status = 'active';
    }

    await account.save();

    ctx.body = {
      code: 200,
      message: '更新广告账户成功',
      data: {
        id: account._id,
        platform: account.platform,
        accountName: account.accountName,
        status: account.status,
      },
    };
  }

  // 删除广告账户
  async delete() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const account = await ctx.model.AdAccount.findOne({
      _id: id,
      userId,
    });

    if (!account) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告账户不存在',
        data: null,
      };
      return;
    }

    await ctx.model.AdAccount.findByIdAndDelete(id);

    ctx.body = {
      code: 200,
      message: '删除广告账户成功',
      data: null,
    };
  }

  // 同步账户信息（余额、统计数据）
  async sync() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const account = await ctx.model.AdAccount.findOne({
      _id: id,
      userId,
    });

    if (!account) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告账户不存在',
        data: null,
      };
      return;
    }

    // TODO: 调用平台API同步账户信息
    // 这里只是示例，实际需要根据平台API实现
    account.balance = Math.random() * 10000; // 示例数据
    account.stats.totalPlans = Math.floor(Math.random() * 100);
    account.stats.activePlans = Math.floor(Math.random() * 50);
    account.lastSyncAt = new Date();
    await account.save();

    ctx.body = {
      code: 200,
      message: '同步账户信息成功',
      data: {
        balance: account.balance,
        stats: account.stats,
        lastSyncAt: account.lastSyncAt,
      },
    };
  }

  // 获取授权URL（用于OAuth授权）
  async getAuthUrl() {
    const { ctx } = this;
    const { platform } = ctx.query;

    ctx.validate({
      platform: { type: 'string', required: true },
    });

    // TODO: 根据平台生成OAuth授权URL
    // 这里只是示例，实际需要根据平台OAuth流程实现
    const authUrl = `https://platform-oauth.example.com/authorize?platform=${platform}&redirect_uri=${encodeURIComponent(ctx.app.config.baseUrl + '/api/ad-account/auth/callback')}`;

    ctx.body = {
      code: 200,
      message: '获取授权URL成功',
      data: {
        authUrl,
        platform,
      },
    };
  }
}

module.exports = AdAccountController;
