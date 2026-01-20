<template>
  <router-view />
</template>

<script setup>
</script>

<style lang="scss">
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #262626;
  min-height: 100vh;
  background: 
    linear-gradient(135deg, #f5f7fa 0%, #fafbfc 100%),
    repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0, 0, 0, 0.01) 10px, rgba(0, 0, 0, 0.01) 20px);
  background-attachment: fixed;
}

// 全局滚动条样式
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 4px;
  
  &:hover {
    background: #bfbfbf;
  }
}
</style>
