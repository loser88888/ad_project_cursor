'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdCreativeSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'AdPlan', required: true },
    creativeName: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], required: true },
    materials: { type: Array, required: true },
    title: { type: String },
    description: { type: String },
    link: { type: String },
    status: { 
      type: String, 
      enum: ['active', 'paused', 'deleted'], 
      default: 'active' 
    },
    stats: {
      impressions: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
      ctr: { type: Number, default: 0 },
      cvr: { type: Number, default: 0 },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 更新时间自动更新
  AdCreativeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // 创建索引
  AdCreativeSchema.index({ userId: 1 });
  AdCreativeSchema.index({ planId: 1 });
  AdCreativeSchema.index({ status: 1 });

  return mongoose.model('AdCreative', AdCreativeSchema);
};
