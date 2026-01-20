<template>
  <div class="login-container">
    <el-card class="login-card card-shadow">
      <template #header>
        <div class="card-header">
          <h2>买量小飞机</h2>
          <p class="subtitle">一站式智能投放工具</p>
        </div>
      </template>
      
      <el-form 
        :model="form" 
        :rules="rules" 
        ref="formRef" 
        label-width="0"
        @submit.prevent="onLogin"
      >
        <el-form-item prop="account">
          <el-input 
            v-model="form.account" 
            placeholder="请输入邮箱或手机号"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
            @keyup.enter="onLogin"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button 
            type="primary" 
            size="large"
            :loading="loading" 
            @click="onLogin"
            style="width: 100%"
          >
            登录
          </el-button>
        </el-form-item>
        
        <el-form-item>
          <div class="register-link">
            还没有账号？
            <el-link type="primary" @click="$router.push('/register')">立即注册</el-link>
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
import { User, Lock } from '@element-plus/icons-vue';
import { useUserStore } from '../store';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const formRef = ref();

const form = reactive({
  account: '',
  password: '',
});

// 验证邮箱或手机号
const validateAccount = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入邮箱或手机号'));
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && 
             !/^1[3-9]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的邮箱或手机号'));
  } else {
    callback();
  }
};

const rules = reactive({
  account: [
    { validator: validateAccount, trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
});

const onLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      
      try {
        // 判断是邮箱还是手机号
        const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.account);
        const credentials = {
          password: form.password,
        };
        
        if (isEmail) {
          credentials.email = form.account;
        } else {
          credentials.phone = form.account;
        }
        
        const response = await userStore.login(credentials);
        ElMessage.success(response.message || '登录成功');
        
        // 跳转到首页
        router.push('/dashboard');
      } catch (error) {
        ElMessage.error(error.message || '登录失败');
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  // 深色模糊背景 - 模拟办公室环境
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(30, 30, 40, 0.9) 100%),
    radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(24, 144, 255, 0.1) 0%, transparent 50%);
  background-size: 100% 100%, 60% 60%, 50% 50%;
  background-position: center, left center, right bottom;
  
  // 添加纹理效果
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
  
  // 添加模糊的几何形状模拟办公室环境
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

.login-card {
  width: 100%;
  max-width: 440px;
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
  
  .register-link {
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
    box-shadow: 0 0 0 1px #1890ff inset;
  }
  
  &.is-focus {
    box-shadow: 0 0 0 2px #1890ff inset;
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
