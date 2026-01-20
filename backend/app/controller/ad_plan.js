'use strict';

const Controller = require('egg').Controller;

class AdPlanController extends Controller {
  // 创建广告计划
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const {
      accountId,
      platform,
      planName,
      planId,
      budget,
      dailyBudget,
      startDate,
      endDate,
      targeting,
    } = ctx.request.body;

    ctx.validate({
      accountId: { type: 'string', required: true },
      platform: { type: 'string', required: true },
      planName: { type: 'string', required: true },
      planId: { type: 'string', required: true },
      budget: { type: 'number', required: false },
      dailyBudget: { type: 'number', required: false },
      startDate: { type: 'date', required: true },
      endDate: { type: 'date', required: false },
      targeting: { type: 'object', required: false },
    });

    const adPlan = new ctx.model.AdPlan({
      userId,
      accountId,
      platform,
      planName,
      planId,
      budget: budget || 0,
      dailyBudget: dailyBudget || 0,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      targeting: targeting || {},
      status: 'active',
    });
    await adPlan.save();

    ctx.status = 201;
    ctx.body = {
      code: 201,
      message: '广告计划创建成功',
      data: adPlan,
    };
  }

  // 获取广告计划列表
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { page = 1, pageSize = 10, platform, status, accountId } = ctx.query;

    const query = { userId };
    if (platform) query.platform = platform;
    if (status) query.status = status;
    if (accountId) query.accountId = accountId;

    const total = await ctx.model.AdPlan.countDocuments(query);
    const plans = await ctx.model.AdPlan.find(query)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 });

    ctx.body = {
      code: 200,
      message: '获取广告计划列表成功',
      data: {
        list: plans,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          pages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  // 获取广告计划详情
  async detail() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const plan = await ctx.model.AdPlan.findOne({
      _id: id,
      userId,
    });

    if (!plan) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告计划不存在',
        data: null,
      };
      return;
    }

    ctx.body = {
      code: 200,
      message: '获取广告计划详情成功',
      data: plan,
    };
  }

  // 更新广告计划
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;
    const updateData = ctx.request.body;

    const plan = await ctx.model.AdPlan.findOne({
      _id: id,
      userId,
    });

    if (!plan) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告计划不存在',
        data: null,
      };
      return;
    }

    // 更新字段
    Object.assign(plan, updateData);
    if (updateData.startDate) plan.startDate = new Date(updateData.startDate);
    if (updateData.endDate) plan.endDate = new Date(updateData.endDate);
    await plan.save();

    ctx.body = {
      code: 200,
      message: '更新广告计划成功',
      data: plan,
    };
  }

  // 删除广告计划
  async delete() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const plan = await ctx.model.AdPlan.findOne({
      _id: id,
      userId,
    });

    if (!plan) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告计划不存在',
        data: null,
      };
      return;
    }

    await ctx.model.AdPlan.findByIdAndDelete(id);

    ctx.body = {
      code: 200,
      message: '删除广告计划成功',
      data: null,
    };
  }

  // 批量更新状态
  async batchUpdateStatus() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { ids, status } = ctx.request.body;

    ctx.validate({
      ids: { type: 'array', required: true },
      status: { type: 'string', required: true, enum: ['active', 'paused', 'deleted'] },
    });

    await ctx.model.AdPlan.updateMany(
      { _id: { $in: ids }, userId },
      { status, updatedAt: Date.now() }
    );

    ctx.body = {
      code: 200,
      message: '批量更新状态成功',
      data: { count: ids.length },
    };
  }

  // 批量删除
  async batchDelete() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { ids } = ctx.request.body;

    ctx.validate({
      ids: { type: 'array', required: true },
    });

    await ctx.model.AdPlan.deleteMany({ _id: { $in: ids }, userId });

    ctx.body = {
      code: 200,
      message: '批量删除成功',
      data: { count: ids.length },
    };
  }
}

module.exports = AdPlanController;
