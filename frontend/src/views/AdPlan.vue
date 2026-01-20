<template>
  <div class="ad-plan-container">
    <el-card class="card-shadow">
      <template #header>
        <div class="card-header">
          <h3>广告计划管理</h3>
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            创建计划
          </el-button>
        </div>
      </template>

      <!-- 批量操作栏 -->
      <div v-if="selectedRows.length > 0" class="batch-actions">
        <el-button type="primary" @click="batchUpdateStatus('active')">
          批量启用 ({{ selectedRows.length }})
        </el-button>
        <el-button type="warning" @click="batchUpdateStatus('paused')">
          批量暂停 ({{ selectedRows.length }})
        </el-button>
        <el-button type="danger" @click="batchDelete">
          批量删除 ({{ selectedRows.length }})
        </el-button>
      </div>

      <!-- 表格 -->
      <el-table
        :data="planList"
        v-loading="loading"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="planName" label="计划名称" width="200" />
        <el-table-column prop="platform" label="平台" width="120">
          <template #default="scope">
            <el-tag>{{ getPlatformName(scope.row.platform) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="budget" label="预算" width="120">
          <template #default="scope">
            ¥{{ scope.row.budget?.toFixed(2) || '0.00' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="editPlan(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deletePlan(scope.row._id)">删除</el-button>
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
import { adPlanApi } from '../api/ad_plan';
import Pagination from '../components/Pagination.vue';

const loading = ref(false);
const selectedRows = ref([]);
const planList = ref([]);

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

const getPlatformName = (platform) => {
  const map = {
    douyin: '抖音',
    kuaishou: '快手',
    wechat: '微信',
    weibo: '微博',
    zhihu: '知乎',
  };
  return map[platform] || platform;
};

const getStatusName = (status) => {
  const map = {
    active: '启用',
    paused: '暂停',
    deleted: '已删除',
  };
  return map[status] || status;
};

const getStatusTagType = (status) => {
  const map = {
    active: 'success',
    paused: 'warning',
    deleted: 'danger',
  };
  return map[status] || '';
};

const loadPlans = async () => {
  loading.value = true;
  try {
    const response = await adPlanApi.list({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    planList.value = response.data.list;
    pagination.total = response.data.pagination.total;
  } catch (error) {
    ElMessage.error(error.message || '获取计划列表失败');
  } finally {
    loading.value = false;
  }
};

const handleSelectionChange = (selection) => {
  selectedRows.value = selection;
};

const handlePageChange = () => {
  loadPlans();
};

const batchUpdateStatus = async (status) => {
  const ids = selectedRows.value.map(row => row._id);
  try {
    await adPlanApi.batchUpdateStatus(ids, status);
    ElMessage.success('批量操作成功');
    selectedRows.value = [];
    loadPlans();
  } catch (error) {
    ElMessage.error(error.message || '批量操作失败');
  }
};

const batchDelete = async () => {
  const ids = selectedRows.value.map(row => row._id);
  try {
    await ElMessageBox.confirm('确定要删除选中的计划吗？', '提示', { type: 'warning' });
    await adPlanApi.batchDelete(ids);
    ElMessage.success('批量删除成功');
    selectedRows.value = [];
    loadPlans();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '批量删除失败');
    }
  }
};

const editPlan = (plan) => {
  // TODO: 实现编辑功能
  ElMessage.info('编辑功能开发中');
};

const deletePlan = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该计划吗？', '提示', { type: 'warning' });
    await adPlanApi.delete(id);
    ElMessage.success('删除成功');
    loadPlans();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

onMounted(() => {
  loadPlans();
});
</script>

<style scoped lang="scss">
.ad-plan-container {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }
  }
  
  .batch-actions {
    margin-bottom: 16px;
    padding: 12px;
    background: #f5f7fa;
    border-radius: 4px;
  }
}
</style>
