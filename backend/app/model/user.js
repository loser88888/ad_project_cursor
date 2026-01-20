'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const UserSchema = new Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['admin', 'user', 'guest'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 更新时间自动更新
  UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

  // 创建索引
  UserSchema.index({ email: 1 }, { unique: true });
  UserSchema.index({ phone: 1 }, { unique: true });
  UserSchema.index({ username: 1 });

  return mongoose.model('User', UserSchema);
};
