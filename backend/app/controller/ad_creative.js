'use strict';

const Controller = require('egg').Controller;
const fs = require('fs');
const path = require('path');

class AdCreativeController extends Controller {
  // 创建广告创意
  async create() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const {
      planId,
      creativeName,
      type,
      materials,
      title,
      description,
      link,
    } = ctx.request.body;

    ctx.validate({
      planId: { type: 'string', required: true },
      creativeName: { type: 'string', required: true },
      type: { type: 'string', required: true, enum: ['image', 'video'] },
      materials: { type: 'array', required: true },
      title: { type: 'string', required: false },
      description: { type: 'string', required: false },
      link: { type: 'string', required: false },
    });

    const creative = new ctx.model.AdCreative({
      userId,
      planId,
      creativeName,
      type,
      materials,
      title,
      description,
      link,
      status: 'active',
    });
    await creative.save();

    ctx.status = 201;
    ctx.body = {
      code: 201,
      message: '广告创意创建成功',
      data: creative,
    };
  }

  // 文件上传
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    
    if (!file) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '请选择要上传的文件',
        data: null,
      };
      return;
    }

    // 文件验证
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi'];
    if (!allowedTypes.includes(file.mime)) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '不支持的文件类型',
        data: null,
      };
      return;
    }

    // 文件大小限制（50MB）
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      ctx.status = 400;
      ctx.body = {
        code: 400,
        message: '文件大小不能超过50MB',
        data: null,
      };
      return;
    }

    // 保存文件（实际项目中应上传到云存储）
    const uploadDir = path.join(ctx.app.config.baseDir, 'app/public/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.filename}`;
    const filePath = path.join(uploadDir, fileName);
    fs.copyFileSync(file.filepath, filePath);

    // 获取文件信息
    const fileUrl = `/uploads/${fileName}`;
    
    ctx.body = {
      code: 200,
      message: '文件上传成功',
      data: {
        url: fileUrl,
        name: file.filename,
        size: file.size,
        type: file.mime,
      },
    };
  }

  // 获取创意列表
  async list() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { page = 1, pageSize = 10, planId, status } = ctx.query;

    const query = { userId };
    if (planId) query.planId = planId;
    if (status) query.status = status;

    const total = await ctx.model.AdCreative.countDocuments(query);
    const creatives = await ctx.model.AdCreative.find(query)
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ createdAt: -1 });

    ctx.body = {
      code: 200,
      message: '获取广告创意列表成功',
      data: {
        list: creatives,
        pagination: {
          total,
          page: Number(page),
          pageSize: Number(pageSize),
          pages: Math.ceil(total / pageSize),
        },
      },
    };
  }

  // 获取创意详情
  async detail() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const creative = await ctx.model.AdCreative.findOne({
      _id: id,
      userId,
    });

    if (!creative) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告创意不存在',
        data: null,
      };
      return;
    }

    ctx.body = {
      code: 200,
      message: '获取广告创意详情成功',
      data: creative,
    };
  }

  // 更新创意
  async update() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;
    const updateData = ctx.request.body;

    const creative = await ctx.model.AdCreative.findOne({
      _id: id,
      userId,
    });

    if (!creative) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告创意不存在',
        data: null,
      };
      return;
    }

    Object.assign(creative, updateData);
    await creative.save();

    ctx.body = {
      code: 200,
      message: '更新广告创意成功',
      data: creative,
    };
  }

  // 删除创意
  async delete() {
    const { ctx } = this;
    const userId = ctx.state.user.id;
    const { id } = ctx.params;

    const creative = await ctx.model.AdCreative.findOne({
      _id: id,
      userId,
    });

    if (!creative) {
      ctx.status = 404;
      ctx.body = {
        code: 404,
        message: '广告创意不存在',
        data: null,
      };
      return;
    }

    await ctx.model.AdCreative.findByIdAndDelete(id);

    ctx.body = {
      code: 200,
      message: '删除广告创意成功',
      data: null,
    };
  }
}

module.exports = AdCreativeController;
