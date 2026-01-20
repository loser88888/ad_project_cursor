<template>
  <div class="ad-creative-container">
    <el-card class="card-shadow">
      <template #header>
        <div class="card-header">
          <h3>广告创意管理</h3>
          <el-button type="primary">
            <el-icon><Plus /></el-icon>
            创建创意
          </el-button>
        </div>
      </template>

      <el-table :data="creativeList" v-loading="loading" border>
        <el-table-column prop="creativeName" label="创意名称" width="200" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="scope">
            <el-tag>{{ scope.row.type === 'image' ? '图片' : '视频' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusName(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button link type="primary" @click="editCreative(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="deleteCreative(scope.row._id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { adCreativeApi } from '../api/ad_creative';
import Pagination from '../components/Pagination.vue';

const loading = ref(false);
const creativeList = ref([]);

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});

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

const loadCreatives = async () => {
  loading.value = true;
  try {
    const response = await adCreativeApi.list({
      page: pagination.page,
      pageSize: pagination.pageSize,
    });
    creativeList.value = response.data.list;
    pagination.total = response.data.pagination.total;
  } catch (error) {
    ElMessage.error(error.message || '获取创意列表失败');
  } finally {
    loading.value = false;
  }
};

const handlePageChange = () => {
  loadCreatives();
};

const editCreative = (creative) => {
  ElMessage.info('编辑功能开发中');
};

const deleteCreative = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除该创意吗？', '提示', { type: 'warning' });
    await adCreativeApi.delete(id);
    ElMessage.success('删除成功');
    loadCreatives();
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败');
    }
  }
};

onMounted(() => {
  loadCreatives();
});
</script>

<style scoped lang="scss">
.ad-creative-container {
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
}
</style>
