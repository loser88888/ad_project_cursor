<template>
  <div class="ad-account-container">
    <div class="page-header">
      <h1 class="page-title">广告账户管理</h1>
      <el-button type="primary" size="large" @click="showAddDialog = true">
        <el-icon><Plus /></el-icon>
        添加账户
      </el-button>
    </div>

    <el-card class="card-shadow">
      <template #header>
        <div class="card-header">
          <span class="section-title">账户列表</span>
        </div>
      </template>

      <!-- 筛选条件 -->
      <el-form :inline="true" :model="filters" class="filter-form" label-width="80px">
        <el-form-item label="平台">
          <el-select v-model="filters.platform" placeholder="请选择平台" clearable>
            <el-option label="全部" value="" />
            <el-option label="抖音" value="douyin" />
            <el-option label="快手" value="kuaishou" />
            <el-option label="微信" value="wechat" />
            <el-option label="微博" value="weibo" />
            <el-option label="知乎" value="zhihu" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filters.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="已过期" value="expired" />
            <el-option label="错误" value="error" />
            <el-option label="未授权" value="unauthorized" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadAccounts">查询</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 账户列表 -->
      <el-table :data="accountList" v-loading="loading" border>
        <el-table-column prop="accountName" label="账户名称" width="200" />
        <el-table-column prop="platform" label="平台" width="120">
          <template #default="scope">
            <el-tag :type="getPlatformTagType(scope.row.platform)">
              {{ getPlatformName(scope.row.platform) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="accountId" label="账户ID" width="150" />
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="scope">
            ¥{{ scope.row.balance?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column prop="stats.activePlans" label="活跃计划" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="lastSyncAt" label="最后同步" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.lastSyncAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="syncAccount(scope.row._id)">同步</el-button>
            <el-button link type="primary" @click="editAccount(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteAccount(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        @page-change="handlePageChange"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import { adAccountApi } from '../api/ad_account';
import Pagination from '../components/Pagination.vue';

const loading = ref(false);
const showAddDialog = ref(false);
const editingAccount = ref(null);

const filters = reactive({
  platform: '',
  status: '',
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const accountList = ref([]);

const getPlatformName = (platform) => {
  const map = {
    douyin: '抖音',
    kuaishou: '快手',
    wechat: '微信',
    weibo: '微博',
    zhihu: '知乎',
    meiyou: '美柚',
  };
  return map[platform] || platform;
};

const getPlatformTagType = (platform) => {
  const map = {
    douyin: 'danger',
    kuaishou: 'warning',
    wechat: 'success',
    weibo: 'info',
    zhihu: '',
  };
  return map[platform] || '';
};

const getStatusName = (status) => {
  const map = {
    active: '正常',
    expired: '已过期',
    error: '错误',
    unauthorized: '未授权',
  };
  return map[status] || status;
};

const getStatusTagType = (status) => {
  const map = {
    active: 'success',
    expired: 'warning',
    error: 'danger',
    unauthorized: 'info',
  };
  return map[status] || '';
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleString('zh-CN');
};

const loadAccounts = async () => {
  loading.value = true;
  try {
    const response = await adAccountApi.list({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters,
    });
    accountList.value = response.data.list;
    pagination.total = response.data.pagination.total;
  } catch (error) {
    ElMessage.error(error.message || '获取账户列表失败');
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.platform = '';
  filters.status = '';
  pagination.page = 1;
  loadAccounts();
};

const handlePageChange = () => {
  loadAccounts();
};

const syncAccount = async (id) => {
  try {
    await adAccountApi.sync(id);
    ElMessage.success('同步成功');
    loadAccounts();
  } catch (error) {
    ElMessage.error(error.message || '同步失败');
  }
};

const editAccount = (account) => {
  editingAccount.value = account;
  showAddDialog.value = true;
};

const deleteAccount = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该账户吗？', '提示', {
      type: 'warning',
    });
    await adAccountApi.delete(id);
    ElMessage.success('删除成功');
    loadAccounts();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

onMounted(() => {
  loadAccounts();
});
</script>

<style scoped lang="scss">
.ad-account-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    .page-title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    
    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #262626;
    }
  }
  
  .filter-form {
    margin-bottom: 20px;
    padding: 20px;
    background: #fafafa;
    border-radius: 8px;
    
    :deep(.el-form-item) {
      margin-bottom: 0;
    }
    
    :deep(.el-form-item__label) {
      font-weight: 500;
      color: #595959;
    }
  }
}

:deep(.el-table) {
  margin-top: 0;
  
  .el-table__header {
    th {
      background-color: #fafafa;
      color: #262626;
      font-weight: 600;
      padding: 16px 0;
    }
  }
  
  .el-table__row {
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    td {
      padding: 16px 0;
    }
  }
}

:deep(.el-card__header) {
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-tag) {
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 4px;
}

:deep(.el-button--text) {
  padding: 4px 8px;
  font-weight: 500;
  
  &:hover {
    background-color: #f0f7ff;
  }
}
</style>
