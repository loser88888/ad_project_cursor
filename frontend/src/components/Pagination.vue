<template>
  <div class="pagination-container">
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :total="total"
      :disabled="total === 0"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange" 
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1,
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  total: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['update:currentPage', 'update:pageSize', 'pageChange']);

const currentPage = computed({
  get: () => props.currentPage,
  set: (val) => emit('update:currentPage', val),
});

const pageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
});

const handleSizeChange = (val) => {
  emit('update:pageSize', val);
  emit('pageChange', props.currentPage, val);
};

const handleCurrentChange = (val) => {
  emit('update:currentPage', val);
  emit('pageChange', val, props.pageSize);
};
</script>

<style scoped lang="scss">
.pagination-container {
  text-align: right;
  margin-top: 24px;
  padding: 16px 0;
}
</style>
