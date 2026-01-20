'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdPlanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: Schema.Types.ObjectId, ref: 'AdAccount', required: true },
    platform: { 
      type: String, 
      required: true,
      enum: ['douyin', 'kuaishou', 'wechat', 'weibo', 'zhihu', 'meiyou'],
    },
    planName: { type: String, required: true },
    planId: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'paused', 'deleted'], 
      default: 'active' 
    },
    budget: { type: Number, default: 0 },
    dailyBudget: { type: Number, default: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    targeting: {
      age: { type: String },
      gender: { type: String },
      region: { type: Array },
      interests: { type: Array },
    },
    stats: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      cost: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 更新时间自动更新
  AdPlanSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // 创建索引
  AdPlanSchema.index({ userId: 1 });
  AdPlanSchema.index({ accountId: 1 });
  AdPlanSchema.index({ status: 1 });
  AdPlanSchema.index({ platform: 1 });
  AdPlanSchema.index({ userId: 1, status: 1 });

  return mongoose.model('AdPlan', AdPlanSchema);
};
