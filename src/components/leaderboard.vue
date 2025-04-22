<template>
  <div class="p-5 bg-white rounded-xl shadow-md">
    <div class="mb-5 text-center">
      <div class="text-sm text-gray-500">最新最热的活动都在这里</div>
    </div>
    
    <el-table 
      v-loading="loading"
      :data="hottestActivitiesList" 
      class="w-full mt-5"
      @row-click="handleRowClick"
      :row-class-name="tableRowClassName"
    >
    <el-table-column prop="title" label="活动名称">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-icon><Trophy /></el-icon>
            <span>{{ row.title }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <el-icon><Calendar /></el-icon>
            <span>{{ formatDateTime(row.start_time) }}</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    
    <el-empty 
      v-if="!loading && !hottestActivitiesList.length" 
      description="暂无活动数据"
      :image-size="100"
    />
  </div>
</template>

<script lang="ts" setup>
import { getLatestActivitiesAPI } from "@/apis";
import { useRequest } from "vue-hooks-plus";
import { ref } from "vue";
import { useMainStore } from "@/stores";
import { useRouter } from 'vue-router';
import { ElMessage } from "element-plus";
import { Calendar, Trophy } from '@element-plus/icons-vue';

interface Activity {
  start_time: string;
  title: string;
  category: string;
  ID: number;
  [key: string]: any;
}

interface ApiResponse {
  code: number;
  message: string;
  data: {
    Activity_list: Activity[];
  };
}

const router = useRouter();
const userStore = useMainStore().useUserStore();
const hottestActivitiesList = ref<Activity[]>([]);
const loading = ref(false);
const activityStore = useMainStore().useActivityStore();

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex === 0) return 'first-row';
  if (rowIndex === 1) return 'second-row';
  if (rowIndex === 2) return 'third-row';
  return '';
};

const { run: fetchActivities } = useRequest(
  () => getLatestActivitiesAPI(userStore.userSession.token) as Promise<ApiResponse>,
  {
    manual: true,
    onBefore() {
      loading.value = true;
    },
    onSuccess(res) {
      if (res.code === 200) {
        hottestActivitiesList.value = res.data.Activity_list;
      } else {
        ElMessage.error(res.message || '获取活动列表失败');
      }
    },
    onError(error) {
      ElMessage.error('获取活动列表失败，请稍后重试');
      console.error('获取活动列表失败:', error);
    },
    onFinally() {
      loading.value = false;
    }
  }
);

// 初始化加载数据
fetchActivities();

// 点击行处理函数
const handleRowClick = (row: Activity) => {
  activityStore.setCurrentActivityId(row.ID);
  router.push('/user/info');
};
</script>

<style scoped>
:deep(.el-table__row) {
  @apply transition-all duration-300 cursor-pointer;
}

:deep(.el-table__row:hover) {
  @apply bg-gray-50 translate-x-1;
}

:deep(.first-row) {
  @apply bg-amber-50;
}

:deep(.second-row) {
  @apply bg-gray-50;
}

:deep(.third-row) {
  @apply bg-red-50;
}

:deep(.el-table__header) {
  @apply bg-gray-50;
}

:deep(.el-table__header th) {
  @apply bg-gray-50 text-gray-600 font-semibold;
}

:deep(.el-table__empty-block) {
  @apply min-h-[200px];
}

:deep(.el-icon) {
  @apply text-blue-500;
}
</style>