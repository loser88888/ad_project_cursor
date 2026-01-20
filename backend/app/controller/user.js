'use strict';

const Controller = require('egg').Controller;
const bcrypt = require('bcryptjs');

class UserController extends Controller {
  // 用户注册
  async register() {
    const { ctx } = this;
    const { username, email, phone, password } = ctx.request.body;

    try {
      // 参数验证
      ctx.validate({
        username: { type: 'string', required: true, min: 2, max: 20 },
        email: { type: 'email', required: true },
        phone: { type: 'string', required: true, pattern: /^1[3-9]\d{9}$/ },
        password: { type: 'string', required: true, min: 6, max: 20 },
      });

      // 邮箱转换为小写（因为模型中设置了 lowercase: true）
      const emailLower = email ? email.trim().toLowerCase() : '';
      const phoneTrim = phone ? phone.trim() : '';

      // 添加调试日志
      ctx.logger.info('注册请求:', { username, email: emailLower, phone: phoneTrim });

      // 分别检查邮箱和手机号是否已存在
      const existingUserByEmail = await ctx.model.User.findOne({ email: emailLower });
      const existingUserByPhone = await ctx.model.User.findOne({ phone: phoneTrim });

      // 调试日志
      if (existingUserByEmail) {
        ctx.logger.warn('邮箱已存在:', { email: emailLower, existingEmail: existingUserByEmail.email });
      }
      if (existingUserByPhone) {
        ctx.logger.warn('手机号已存在:', { phone: phoneTrim, existingPhone: existingUserByPhone.phone });
      }

      if (existingUserByEmail || existingUserByPhone) {
        ctx.status = 400;
        let message = '注册失败';
        if (existingUserByEmail && existingUserByPhone) {
          message = '邮箱和手机号都已被注册';
        } else if (existingUserByEmail) {
          message = '邮箱已被注册';
        } else if (existingUserByPhone) {
          message = '手机号已被注册';
        }
        ctx.body = {
          code: 400,
          message,
          data: null,
        };
        return;
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const user = new ctx.model.User({
        username: username.trim(),
        email: emailLower,
        phone: phoneTrim,
        password: hashedPassword,
      });

      // 保存用户，捕获可能的唯一索引错误
      try {
        await user.save();
      } catch (saveError) {
        // 处理 MongoDB 唯一索引冲突错误
        if (saveError.code === 11000) {
          const duplicateField = saveError.keyPattern;
          let message = '注册失败';
          if (duplicateField.email) {
            message = '邮箱已被注册';
          } else if (duplicateField.phone) {
            message = '手机号已被注册';
          }
          ctx.status = 400;
          ctx.body = {
            code: 400,
            message,
            data: null,
          };
          return;
        }
        // 其他错误继续抛出
        throw saveError;
      }

      ctx.status = 201;
      ctx.body = {
        code: 201,
        message: '用户注册成功',
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      };
    } catch (error) {
      // 处理验证错误
      if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        ctx.status = 400;
        ctx.body = {
          code: 400,
          message: firstError.message || '参数验证失败',
          data: null,
        };
        return;
      }

      // 其他错误
      ctx.logger.error('用户注册失败:', error);
      ctx.status = 500;
      ctx.body = {
        code: 500,
        message: error.message || '注册失败，请稍后重试',
        data: null,
      };
    }
  }

  // 用户登录
  async login() {
    const { ctx } = this;
    const { email, phone, password } = ctx.request.body;

    // 验证参数（email 和 phone 至少提供一个）
    if (!email && !phone) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请提供邮箱或手机号',
        data: null,
      };
      return;
    }

    ctx.validate({
      email: { type: 'email', required: false },
      phone: { type: 'string', required: false },
      password: { type: 'string', required: true },
    });

    // 查找用户（邮箱需要转换为小写）
    const emailLower = email ? email.toLowerCase() : null;
    const user = await ctx.model.User.findOne({
      $or: emailLower ? [{ email: emailLower }] : [{ phone }],
    }).select('+password');
    
    if (!user) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '用户不存在',
        data: null,
      };
      return;
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      ctx.status = 401;
      ctx.body = {
        code: 401,
        message: '密码错误',
        data: null,
      };
      return;
    }

    // 检查用户状态
    if (user.status !== 'active') {
      ctx.status = 403;
      ctx.body = {
        code: 403,
        message: '账户已被禁用',
        data: null,
      };
      return;
    }

    // 生成JWT令牌
    const token = ctx.app.jwt.sign(
      { id: user._id.toString(), role: user.role },
      ctx.app.config.jwt.secret,
      { expiresIn: ctx.app.config.jwt.expiresIn }
    );

    ctx.body = {
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
      },
    };
  }

  // 获取用户信息
  async getUserInfo() {
    const { ctx } = this;
    const userId = ctx.state.user.id;

    const user = await ctx.model.User.findById(userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '用户不存在',
        data: null,
      };
      return;
    }

    ctx.body = {
      code: 200,
      message: '获取用户信息成功',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  // 更新用户信息
  async updateUserInfo() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { username, avatar } = ctx.request.body;

    ctx.validate({
      username: { type: 'string', required: false, min: 2, max: 20 },
      avatar: { type: 'string', required: false },
    });

    const updateData = {};
    if (username) updateData.username = username;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await ctx.model.User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    ctx.body = {
      code: 200,
      message: '更新用户信息成功',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  // 检查邮箱是否存在（调试用）
  async checkEmail() {
    const { ctx } = this;
    const { email } = ctx.query;

    if (!email) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请提供邮箱',
        data: null,
      };
      return;
    }

    const emailLower = email.toLowerCase();
    const user = await ctx.model.User.findOne({ email: emailLower });

    ctx.body = {
      code: 200,
      message: user ? '邮箱已存在' : '邮箱不存在',
      data: {
        exists: !!user,
        email: emailLower,
        user: user ? {
          id: user._id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
        } : null,
      },
    };
  }

  // 修改密码
  async changePassword() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { oldPassword, newPassword } = ctx.request.body;

    ctx.validate({
      oldPassword: { type: 'string', required: true },
      newPassword: { type: 'string', required: true, min: 6, max: 20 },
    });

    const user = await ctx.model.User.findById(userId).select('+password');
    if (!user) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '用户不存在',
        data: null,
      };
      return;
    }

    // 验证旧密码
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '旧密码错误',
        data: null,
      };
      return;
    }

    // 加密新密码
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    ctx.body = {
      code: 200,
      message: '密码修改成功',
      data: null,
    };
  }
}

module.exports = UserController;
