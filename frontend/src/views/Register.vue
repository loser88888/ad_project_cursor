<template>
  <div class="register-container">
    <el-card class="register-card card-shadow">
      <template #header>
        <div class="card-header">
          <h2>注册账号</h2>
          <p class="subtitle">创建您的买量小飞机账号</p>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="0"
      >
        <el-form-item prop="username">
          <el-input 
            v-model="form.username" 
            placeholder="请输入用户名（2-20个字符）"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="email">
          <el-input 
            v-model="form.email" 
            placeholder="请输入邮箱"
            size="large"
            :prefix-icon="Message"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="phone">
          <el-input 
            v-model="form.phone" 
            placeholder="请输入手机号"
            size="large"
            :prefix-icon="Phone"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码（6-20个字符）"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="confirmPassword">
          <el-input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large"
            :loading="loading" 
            @click="onRegister"
            style="width: 100%"
          >
            注册
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="login-link">
            已有账号？
            <el-link type="primary" @click="$router.push('/login')">立即登录</el-link>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, Message, Phone } from '@element-plus/icons-vue';
import { userApi } from '../api/user';

const router = useRouter();
const loading = ref(false);
const formRef = ref();

const form = reactive({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
});

// 验证确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入密码'));
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度为2-20个字符', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为6-20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
});

const onRegister = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        const response = await userApi.register({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password: form.password,
        });
        
        ElMessage.success(response.message || '注册成功');
        
        // 跳转到登录页
        setTimeout(() => {
          router.push('/login');
        }, 1000);
      } catch (error) {
        ElMessage.error(error.message || '注册失败');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped lang="scss">
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  // 深色模糊背景 - 与登录页保持一致
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 40, 0.9) 100%),
    radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(24, 144, 255, 0.1) 0%, transparent 50%);
  background-size: 100% 100%, 60% 60%, 50% 50%;
  background-position: center, left center, right bottom;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px),
      repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255, 255, 255, 0.03) 2px, rgba(255, 255, 255, 0.03) 4px);
    opacity: 0.4;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 80%;
    height: 150%;
    background: 
      radial-gradient(ellipse at 30% 40%, rgba(76, 175, 80, 0.15) 0%, transparent 50%),
      linear-gradient(135deg, rgba(100, 100, 120, 0.2) 0%, transparent 100%);
    filter: blur(60px);
    transform: rotate(-15deg);
    pointer-events: none;
  }
}

.register-card {
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  :deep(.el-card__header) {
    background: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    padding: 32px 40px 24px;
  }
  
  :deep(.el-card__body) {
    padding: 40px;
    background: transparent;
  }
  
  .card-header {
    text-align: center;
    margin-bottom: 32px;
    
    h2 {
      margin: 0 0 12px 0;
      color: #4caf50;
      font-size: 32px;
      font-weight: 600;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      
      &::before {
        content: '✈';
        font-size: 28px;
        color: #4caf50;
      }
    }
    
    .subtitle {
      margin: 0;
      color: #595959;
      font-size: 14px;
      font-weight: 400;
    }
  }
  
  .login-link {
    text-align: center;
    width: 100%;
    color: #8c8c8c;
    font-size: 14px;
    
    .el-link {
      font-weight: 500;
      color: #4caf50;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  padding: 12px 16px;
  box-shadow: 0 0 0 1px #e8e8e8 inset;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 0 0 1px #4caf50 inset;
  }
  
  &.is-focus {
    box-shadow: 0 0 0 2px #4caf50 inset;
  }
}

:deep(.el-button--primary) {
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.5px;
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s;
  
  &:hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
</style>
