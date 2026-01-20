<template>
  <div class="dashboard-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">数据概览</h1>
      <div class="header-actions">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="default"
          style="width: 300px"
        />
      </div>
    </div>

    <!-- 数据卡片 -->
    <el-row :gutter="24" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6" v-for="(item, index) in summaryCards" :key="index">
        <el-card class="summary-card card-shadow" :class="`card-${index}`">
          <div class="card-content">
            <div class="card-icon-wrapper">
              <div class="card-icon" :style="{ background: item.gradient }">
                <el-icon :size="28"><component :is="item.icon" /></el-icon>
              </div>
            </div>
            <div class="card-info">
              <div class="card-value">{{ item.value }}</div>
              <div class="card-label">{{ item.label }}</div>
              <div class="card-trend" v-if="item.trend">
                <el-icon :class="item.trend > 0 ? 'trend-up' : 'trend-down'">
                  <component :is="item.trend > 0 ? 'ArrowUp' : 'ArrowDown'" />
                </el-icon>
                <span :class="item.trend > 0 ? 'trend-up' : 'trend-down'">
                  {{ Math.abs(item.trend) }}%
                </span>
                <span class="trend-text">较昨日</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="24" class="mt-24">
      <el-col :xs="24" :lg="16">
        <el-card class="card-shadow chart-card">
          <template #header>
            <div class="card-header">
              <h3 class="section-title">数据趋势</h3>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="消耗">消耗</el-radio-button>
                <el-radio-button label="转化">转化</el-radio-button>
                <el-radio-button label="ROI">ROI</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="chartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="8">
        <el-card class="card-shadow">
          <template #header>
            <h3 class="section-title">平台分布</h3>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快速操作 -->
    <el-row :gutter="24" class="mt-24">
      <el-col :span="24">
        <el-card class="card-shadow">
          <template #header>
            <h3 class="section-title">快速操作</h3>
          </template>
          <div class="quick-actions">
            <el-button type="primary" size="large" @click="$router.push('/ad-account')">
              <el-icon><Plus /></el-icon>
              添加广告账户
            </el-button>
            <el-button type="primary" size="large" @click="$router.push('/ad-plan')">
              <el-icon><DocumentAdd /></el-icon>
              创建广告计划
            </el-button>
            <el-button type="primary" size="large" @click="$router.push('/ad-creative')">
              <el-icon><Upload /></el-icon>
              上传创意素材
            </el-button>
            <el-button type="primary" size="large" @click="$router.push('/statistics')">
              <el-icon><DataAnalysis /></el-icon>
              查看详细报表
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';
import { 
  DataBoard, Wallet, Document, Picture, 
  ArrowUp, ArrowDown, Plus, DocumentAdd, Upload, DataAnalysis 
} from '@element-plus/icons-vue';

const chartRef = ref(null);
const pieChartRef = ref(null);
let chartInstance = null;
let pieChartInstance = null;
const dateRange = ref([]);
const chartType = ref('消耗');

const summaryCards = ref([
  { 
    label: '总账户数', 
    value: '12', 
    icon: 'Wallet', 
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trend: 8.5
  },
  { 
    label: '活跃计划', 
    value: '156', 
    icon: 'Document', 
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trend: 12.3
  },
  { 
    label: '今日消耗', 
    value: '¥128,560', 
    icon: 'DataBoard', 
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    trend: -5.2
  },
  { 
    label: '总创意数', 
    value: '1,248', 
    icon: 'Picture', 
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    trend: 15.8
  },
]);

const initCharts = () => {
  // 趋势图
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    const dates = [];
    const costs = [];
    const conversions = [];
    const rois = [];
    
    // 生成示例数据（最近7天）
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
      costs.push(Math.floor(Math.random() * 50000 + 80000));
      conversions.push(Math.floor(Math.random() * 500 + 800));
      rois.push((Math.random() * 0.5 + 1.2).toFixed(2));
    }
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#1890ff',
        borderWidth: 1,
      },
      legend: {
        data: ['消耗', '转化', 'ROI'],
        top: 10,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#e8e8e8',
          },
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '消耗/转化',
          axisLine: {
            lineStyle: {
              color: '#e8e8e8',
            },
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0',
            },
          },
        },
        {
          type: 'value',
          name: 'ROI',
          axisLine: {
            lineStyle: {
              color: '#e8e8e8',
            },
          },
        },
      ],
      series: [
        {
          name: '消耗',
          type: 'line',
          smooth: true,
          data: costs,
          itemStyle: {
            color: '#1890ff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
                { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
              ],
            },
          },
        },
        {
          name: '转化',
          type: 'line',
          smooth: true,
          data: conversions,
          itemStyle: {
            color: '#52c41a',
          },
        },
        {
          name: 'ROI',
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          data: rois,
          itemStyle: {
            color: '#faad14',
          },
        },
      ],
    };
    chartInstance.setOption(option);
  }

  // 饼图
  if (pieChartRef.value) {
    pieChartInstance = echarts.init(pieChartRef.value);
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: ¥{c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
      },
      series: [
        {
          name: '平台消耗',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{b}\n{d}%',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          data: [
            { value: 45680, name: '抖音' },
            { value: 32150, name: '快手' },
            { value: 28940, name: '微信' },
            { value: 15790, name: '微博' },
            { value: 6000, name: '其他' },
          ],
        },
      ],
    };
    pieChartInstance.setOption(option);
  }
};

watch(chartType, () => {
  // 切换图表类型时可以更新数据
  if (chartInstance) {
    // 这里可以根据 chartType 更新图表
  }
});

onMounted(() => {
  initCharts();
  
  // 响应式处理
  window.addEventListener('resize', () => {
    chartInstance?.resize();
    pieChartInstance?.resize();
  });
});
</script>

<style scoped lang="scss">
.dashboard-container {
  position: relative;
  
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 24px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(250, 251, 252, 0.9) 100%);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    
    .page-title {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #262626;
      display: flex;
      align-items: center;
      gap: 12px;
      
      &::before {
        content: '';
        width: 4px;
        height: 24px;
        background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        border-radius: 2px;
      }
    }
    
    .header-actions {
      display: flex;
      gap: 16px;
    }
  }
  
  .stats-row {
    margin-bottom: 24px;
  }
  
  .summary-card {
    height: 100%;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }
    
    .card-content {
      display: flex;
      align-items: flex-start;
      gap: 20px;
      
      .card-icon-wrapper {
        flex-shrink: 0;
        
        .card-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
      
      .card-info {
        flex: 1;
        min-width: 0;
        
        .card-value {
          font-size: 28px;
          font-weight: 600;
          color: #262626;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        
        .card-label {
          font-size: 14px;
          color: #8c8c8c;
          margin-bottom: 8px;
        }
        
        .card-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          
          .trend-up {
            color: #52c41a;
          }
          
          .trend-down {
            color: #f5222d;
          }
          
          .trend-text {
            color: #8c8c8c;
            margin-left: 4px;
          }
        }
      }
    }
  }
  
  .chart-card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 251, 252, 0.95) 100%);
    border: 1px solid rgba(0, 0, 0, 0.06);
    backdrop-filter: blur(10px);
    
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: transparent;
    }
    
    .chart-container {
      width: 100%;
      height: 400px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 8px;
      padding: 16px;
    }
  }
  
  .quick-actions {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    
    .el-button {
      flex: 1;
      min-width: 180px;
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .dashboard-container {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }
    
    .quick-actions {
      .el-button {
        min-width: 100%;
      }
    }
  }
}
</style>
