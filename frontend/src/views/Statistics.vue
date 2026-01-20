<template>
  <div class="statistics-container">
    <el-card class="card-shadow">
      <template #header>
        <h3>数据统计</h3>
      </template>
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import { statisticsApi } from '../api/statistics';

const chartRef = ref(null);
let chartInstance = null;

onMounted(async () => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    
    try {
      const response = await statisticsApi.getStatistics({ timeRange: '7d' });
      const { costTrend } = response.data;
      
      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['消耗', '转化'],
        },
        xAxis: {
          type: 'category',
          data: costTrend.dates || [],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '消耗',
            type: 'line',
            data: costTrend.costs || [],
            smooth: true,
          },
          {
            name: '转化',
            type: 'line',
            data: costTrend.conversions || [],
            smooth: true,
          },
        ],
      };
      chartInstance.setOption(option);
    } catch (error) {
      console.error('获取统计数据失败', error);
    }
  }
});
</script>

<style scoped lang="scss">
.statistics-container {
  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }
}
</style>
