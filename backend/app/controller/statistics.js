'use strict';

const Controller = require('egg').Controller;

class StatisticsController extends Controller {
  // 获取统计数据
  async getStatistics() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { timeRange = '7d', platform, planId } = ctx.query;

    // 计算时间范围
    const now = new Date();
    let startDate = new Date();
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // 构建查询条件
    const query = { userId, date: { $gte: startDate, $lte: now } };
    if (platform) query.platform = platform;
    if (planId) query.planId = planId;

    // 聚合统计数据
    const stats = await ctx.model.Statistics.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalImpressions: { $sum: '$metrics.impressions' },
          totalClicks: { $sum: '$metrics.clicks' },
          totalConversions: { $sum: '$metrics.conversions' },
          totalCost: { $sum: '$metrics.cost' },
          totalRevenue: { $sum: '$metrics.revenue' },
        },
      },
    ]);

    // 按日期聚合（用于趋势图）
    const trendData = await ctx.model.Statistics.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          impressions: { $sum: '$metrics.impressions' },
          clicks: { $sum: '$metrics.clicks' },
          conversions: { $sum: '$metrics.conversions' },
          cost: { $sum: '$metrics.cost' },
          revenue: { $sum: '$metrics.revenue' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 按平台聚合（用于平台对比）
    const platformData = await ctx.model.Statistics.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$platform',
          impressions: { $sum: '$metrics.impressions' },
          clicks: { $sum: '$metrics.clicks' },
          conversions: { $sum: '$metrics.conversions' },
          cost: { $sum: '$metrics.cost' },
          revenue: { $sum: '$metrics.revenue' },
        },
      },
    ]);

    // 计算指标
    const summary = stats[0] || {};
    const summaryData = {
      totalImpressions: summary.totalImpressions || 0,
      totalClicks: summary.totalClicks || 0,
      totalConversions: summary.totalConversions || 0,
      totalCost: summary.totalCost || 0,
      totalRevenue: summary.totalRevenue || 0,
      ctr: summary.totalImpressions > 0 
        ? (summary.totalClicks / summary.totalImpressions * 100).toFixed(2) 
        : 0,
      cvr: summary.totalClicks > 0 
        ? (summary.totalConversions / summary.totalClicks * 100).toFixed(2) 
        : 0,
      roi: summary.totalCost > 0 
        ? ((summary.totalRevenue - summary.totalCost) / summary.totalCost * 100).toFixed(2) 
        : 0,
    };

    // 格式化趋势数据
    const costTrend = {
      dates: trendData.map(item => item._id),
      costs: trendData.map(item => item.cost),
      conversions: trendData.map(item => item.conversions),
    };

    // 格式化平台对比数据
    const platformComparison = {
      platforms: platformData.map(item => item._id),
      costs: platformData.map(item => item.cost),
      conversions: platformData.map(item => item.conversions),
      rois: platformData.map(item => 
        item.cost > 0 ? ((item.revenue - item.cost) / item.cost * 100).toFixed(2) : 0
      ),
    };

    ctx.body = {
      code: 200,
      message: '获取统计数据成功',
      data: {
        summary: summaryData,
        costTrend,
        platformComparison,
      },
    };
  }
}

module.exports = StatisticsController;
