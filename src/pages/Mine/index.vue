<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores';
import getMineActivitiesAPI from '@/apis/service/activity/getMine';
import deleteActivityAPI from '@/apis/service/activity/delete';
import { useRequest } from 'vue-hooks-plus';
import { ElMessage, ElMessageBox } from 'element-plus';

const router = useRouter();
const userStore = useMainStore().useUserStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

const activityStore = useMainStore().useActivityStore();

const { data: activities, loading, run: fetchActivities } = useRequest(
  () => getMineActivitiesAPI(
    userStore.userSession.token,
    currentPage.value,
    pageSize.value
  ),
  {
    manual: true,
    onSuccess: (res) => {
      if (res.code === 200) {
        total.value = res.data.Activity_list.length;
      } else {
        ElMessage.error('获取活动列表失败');
      }
    },
    onError: (error) => {
      ElMessage.error('获取活动列表失败');
      console.error(error);
    }
  }
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

// 删除活动
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除这个活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await deleteActivityAPI(userStore.userSession.token, id);
    ElMessage.success('删除成功');
    fetchActivities(); // 刷新列表
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败');
      console.error(error);
    }
  }
};

// 跳转到活动详情页
const goToActivityDetail = (activityId: number) => {
  activityStore.setCurrentActivityId(activityId);
  router.push('/user/info');
};

onMounted(() => {
  fetchActivities();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-800">我的活动</h2>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!activities?.data?.Activity_list?.length" class="text-center py-8">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500">暂无活动记录</p>
        </div>

        <!-- 活动列表 -->
        <div v-else class="space-y-4">
          <div v-for="activity in activities.data.Activity_list" :key="activity.ID"
            class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
            @click="goToActivityDetail(activity.ID)">
            <div class="flex justify-between items-start">
              <h3 class="text-lg font-medium text-gray-800">{{ activity.title }}</h3>
              <div class="flex items-center gap-2">
                <span class="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
                  {{ activity.category }}
                </span>
                <span class="flex items-center text-sm text-gray-500">
                  <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ activity.upvote }}
                </span>
                <button
                  @click.stop="handleDelete(activity.ID)"
                  class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                  title="删除活动"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span class="text-sm">删除</span>
                </button>
              </div>
            </div>

            <div class="mt-4 text-sm text-gray-600 space-y-2">
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                开始时间：{{ formatDate(activity.start_time) }}
              </div>
              <div class="flex items-center gap-2">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ activity.location }}
              </div>
              <div class="flex items-center gap-2 text-red-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                截止时间：{{ formatDate(activity.deadline) }}
              </div>
            </div>

            <p class="mt-4 text-sm text-gray-500 line-clamp-2">{{ activity.content }}</p>
          </div>

          <!-- 分页 -->
          <div class="flex justify-center mt-6">
            <el-pagination
              v-model:current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              @current-change="handlePageChange"
              layout="prev, pager, next"
              class="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
