'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const StatisticsSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'AdPlan' },
    creativeId: { type: Schema.Types.ObjectId, ref: 'AdCreative' },
    date: { type: Date, required: true },
    platform: { type: String, required: true },
    metrics: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      cost: { type: Number, default: 0 },
      revenue: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      cvr: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 更新时间自动更新
  StatisticsSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // 创建索引
  StatisticsSchema.index({ userId: 1 });
  StatisticsSchema.index({ planId: 1 });
  StatisticsSchema.index({ creativeId: 1 });
  StatisticsSchema.index({ date: 1 });
  StatisticsSchema.index({ platform: 1 });
  StatisticsSchema.index({ userId: 1, date: 1 });

  return mongoose.model('Statistics', StatisticsSchema);
};
