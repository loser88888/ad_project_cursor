'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdAccountSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { 
      type: String, 
      required: true,
      enum: ['douyin', 'kuaishou', 'wechat', 'weibo', 'zhihu', 'meiyou'],
    },
    accountName: { type: String, required: true },
    accountId: { type: String, required: true },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
    expiresIn: { type: Number, required: true },
    tokenExpiresAt: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'error', 'unauthorized'], 
      default: 'active' 
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'CNY' },
    stats: {
      totalSpent: { type: Number, default: 0 },
      todaySpent: { type: Number, default: 0 },
      totalPlans: { type: Number, default: 0 },
      activePlans: { type: Number, default: 0 },
    },
    lastSyncAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 更新时间自动更新
  AdAccountSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // 创建索引
  AdAccountSchema.index({ userId: 1 });
  AdAccountSchema.index({ platform: 1 });
  AdAccountSchema.index({ platform: 1, accountId: 1 }, { unique: true });
  AdAccountSchema.index({ status: 1 });
  AdAccountSchema.index({ userId: 1, platform: 1 });

  return mongoose.model('AdAccount', AdAccountSchema);
};
