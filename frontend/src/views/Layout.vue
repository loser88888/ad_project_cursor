<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo">
            <span class="logo-text">买量小飞机</span>
            <span class="logo-subtitle">一站式智能投放工具</span>
          </div>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="user-info">
              <el-avatar :src="userStore.user?.avatar" :size="36">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="username">{{ userStore.user?.username || '用户' }}</span>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  <span style="margin-left: 8px">个人设置</span>
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon>
                  <span style="margin-left: 8px">退出登录</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="220px" class="aside">
        <el-menu
          :default-active="activeMenu"
          router
          class="sidebar-menu"
          :collapse="false"
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataBoard /></el-icon>
            <template #title>数据概览</template>
          </el-menu-item>
          <el-menu-item index="/ad-account">
            <el-icon><Wallet /></el-icon>
            <template #title>广告账户</template>
          </el-menu-item>
          <el-menu-item index="/ad-plan">
            <el-icon><Document /></el-icon>
            <template #title>广告计划</template>
          </el-menu-item>
          <el-menu-item index="/ad-creative">
            <el-icon><Picture /></el-icon>
            <template #title>广告创意</template>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <el-icon><DataAnalysis /></el-icon>
            <template #title>数据统计</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { DataBoard, Wallet, Document, Picture, DataAnalysis, ArrowDown, User, Setting, SwitchButton } from '@element-plus/icons-vue';
import { useUserStore } from '../store';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const activeMenu = computed(() => route.path);

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      type: 'warning',
    }).then(() => {
      userStore.logout();
      router.push('/login');
    }).catch(() => {});
  } else if (command === 'settings') {
    // TODO: 跳转到设置页面
    ElMessageBox.alert('设置功能开发中', '提示');
  }
};
</script>

<style scoped lang="scss">
.layout-container {
  height: 100vh;
  background: #f5f7fa;
  
  .header {
    height: 64px;
    background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
    border-bottom: 1px solid #e8e8e8;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;
    z-index: 100;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 32px;
      max-width: 100%;
    }
    
    .header-left {
      .logo {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .logo-text {
          font-size: 20px;
          font-weight: 600;
          color: #4caf50;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
          
          &::before {
            content: '✈';
            font-size: 18px;
          }
        }
        
        .logo-subtitle {
          font-size: 12px;
          color: #8c8c8c;
          padding-left: 12px;
          border-left: 1px solid #e8e8e8;
        }
      }
    }
    
    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 12px;
        padding: 8px 16px;
        border-radius: 6px;
        transition: background-color 0.3s;
        
        &:hover {
          background-color: #f5f5f5;
        }
        
        .username {
          font-size: 14px;
          color: #262626;
          font-weight: 500;
        }
        
        .dropdown-icon {
          font-size: 12px;
          color: #8c8c8c;
          transition: transform 0.3s;
        }
      }
    }
  }
  
  .aside {
    background: #fff;
    border-right: 1px solid #e8e8e8;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.04);
    
    .sidebar-menu {
      border-right: none;
      height: 100%;
      
      :deep(.el-menu-item) {
        height: 48px;
        line-height: 48px;
        margin: 4px 8px;
        border-radius: 6px;
        
        &:hover {
          background-color: #f0f7ff;
          color: #1890ff;
        }
        
        &.is-active {
          background-color: #e6f7ff;
          color: #1890ff;
          font-weight: 500;
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 3px;
            height: 20px;
            background-color: #1890ff;
            border-radius: 0 2px 2px 0;
          }
        }
      }
    }
  }
  
  .main-content {
    background: 
      linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%),
      repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.01) 10px, rgba(0, 0, 0, 0.01) 20px);
    padding: 24px 32px;
    overflow-y: auto;
    position: relative;
    
    // 添加微妙的纹理背景
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(76, 175, 80, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(24, 144, 255, 0.03) 0%, transparent 50%);
      pointer-events: none;
      z-index: 0;
    }
    
    > * {
      position: relative;
      z-index: 1;
    }
  }
}
</style>
