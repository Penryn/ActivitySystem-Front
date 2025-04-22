<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import getNewestActivitiesAPI from '../apis/service/home/getNewestActivities';
import { useMainStore } from "@/stores";
import { useRequest } from "vue-hooks-plus";

interface Activity {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  title: string;
  content: string;
  location: string;
  category: string;
  user_id: number;
  upvote: number;
  img: string;
  deadline: string;
  start_time: string;
}

interface ActivityResponse {
  code: number;
  data: {
    Activity_list: Activity[];
  };
  msg: string;
}

const props = defineProps<{
  searchText?: string;
  filterType?: string;
}>();

const router = useRouter();
const userStore = useMainStore().useUserStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const activityStore = useMainStore().useActivityStore();

const { data: activities, loading, run: fetchActivities } = useRequest<ActivityResponse>(
  () => getNewestActivitiesAPI(
    userStore.userSession.token,
    props.searchText,
    props.filterType,
    currentPage.value,
    pageSize.value
  ),
  {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        total.value = res.data.Activity_list.length;
      } else {
        console.error('获取活动列表失败:', res);
      }
    },
    onError: (error) => {
      console.error('请求出错:', error);
    }
  }
);

// 监听筛选条件变化
watch(
  () => [props.searchText, props.filterType],
  () => {
    currentPage.value = 1; // 重置页码
    fetchActivities();
  },
  { immediate: true }
);

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  fetchActivities();
};

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 返回顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 跳转到活动详情页
const goToActivityDetail = (activityId: number) => {
  activityStore.setCurrentActivityId(activityId);
  router.push('/user/info');
};
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>

    <div v-else-if="!activities?.data?.Activity_list?.length" class="text-center py-8 text-gray-500">
      暂无活动
    </div>

    <div v-else class="space-y-4">
      <div class="grid gap-4">
        <div v-for="activity in activities.data.Activity_list" :key="activity.ID"
          class="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
          @click="goToActivityDetail(activity.ID)">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-800">{{ activity.title }}</h3>
            <div class="flex items-center gap-2">
              <span class="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
                {{ activity.category }}
              </span>
              <span class="flex items-center text-sm text-gray-500">
                <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ activity.upvote }}
              </span>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              开始时间：{{ formatDate(activity.start_time) }}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ activity.location }}
            </div>
            <div class="flex items-center gap-2 mt-1 text-red-500">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              截止时间：{{ formatDate(activity.deadline) }}
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-500 line-clamp-2">{{ activity.content.slice(0, 60) }}{{ activity.content.length > 15 ? '...' : '' }}</p>
        </div>
      </div>

      <!-- 分页 -->
      <div class="flex justify-center mt-6">
        <div class="flex items-center gap-2">
          <button
            v-for="page in Math.ceil(total / pageSize)"
            :key="page"
            @click="handlePageChange(page)"
            class="px-3 py-1 rounded-md transition-colors"
            :class="{
              'bg-indigo-600 text-white': currentPage === page,
              'bg-white text-gray-700 hover:bg-gray-100': currentPage !== page
            }"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 返回顶部按钮 -->
  <button
    @click="scrollToTop"
    class="fixed bottom-8 right-8 p-3 bg-white/80 backdrop-blur-sm text-indigo-600 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-indigo-200"
  >
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
</template>