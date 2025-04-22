<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores';
import getSignUpActivitiesAPI from '@/apis/service/activity/getSignUp';
import getActivityAPI from '@/apis/service/activity/get';
import cancelSignUpActivityAPI from '@/apis/service/activity/cancelSignUp';
import { useRequest } from 'vue-hooks-plus';
import { ElMessage, ElMessageBox } from 'element-plus';


interface Activity {
  ID: number;
  title: string;
  content: string;
  location: string;
  category: string;
  img: string;
  deadline: string;
  start_time: string;
}

interface ActivityResponse {
  code: number;
  data: {
    activity: Activity;
    status: boolean;
  };
  msg: string;
}

interface CancelSignUpResponse {
  code: number;
  msg: string;
}

const router = useRouter();
const userStore = useMainStore().useUserStore();
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const activityDetails = ref<Record<number, Activity>>({});
const activityStore = useMainStore().useActivityStore();

const { data: activities, loading, run: fetchActivities } = useRequest(
  () => getSignUpActivitiesAPI(
    userStore.userSession.token,
    currentPage.value,
    pageSize.value
  ),
  {
    manual: true,
    onSuccess: async (res) => {
      if (res.code === 200) {
        total.value = res.data.num;
        // 获取每个活动的详情
        for (const record of res.data.record_list) {
          try {
            const activityRes = await getActivityAPI(userStore.userSession.token, record.activity_id) as ActivityResponse;
            if (activityRes.code === 200) {
              activityDetails.value[record.activity_id] = activityRes.data.activity;
            }
          } catch (error) {
            console.error('获取活动详情失败:', error);
          }
        }
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

// 取消报名
const handleCancelSignUp = async (activityId: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要取消报名该活动吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );
    
    const res = await cancelSignUpActivityAPI(userStore.userSession.token, activityId) as CancelSignUpResponse;
    if (res.code === 200) {
      ElMessage.success('取消报名成功');
      fetchActivities(); // 重新获取活动列表
    } else {
      ElMessage.error('取消报名失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消报名失败');
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
          <h2 class="text-2xl font-bold text-gray-800">已报名活动</h2>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!activities?.data?.record_list?.length" class="text-center py-8">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-500">暂无报名记录</p>
        </div>

        <!-- 活动列表 -->
        <div v-else class="space-y-4">
          <div v-for="record in activities.data.record_list" :key="record.ID"
            class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 cursor-pointer"
            @click="goToActivityDetail(record.activity_id)">
            <div class="flex flex-col gap-4">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-800">
                  {{ activityDetails[record.activity_id]?.title || '加载中...' }}
                </h3>
                <div class="flex items-center gap-4">
                  <span class="text-sm text-gray-500">
                    报名时间：{{ formatDate(record.CreatedAt) }}
                  </span>
                  <el-button
                    type="danger"
                    size="small"
                    @click.stop="handleCancelSignUp(record.activity_id)"
                  >
                    取消报名
                  </el-button>
                </div>
              </div>
              <div v-if="activityDetails[record.activity_id]" class="space-y-2">
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <span>📍 {{ activityDetails[record.activity_id].location }}</span>
                  <span>|</span>
                  <span>🏷️ {{ activityDetails[record.activity_id].category }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-500">
                  <span>⏰ 开始时间：{{ formatDate(activityDetails[record.activity_id].start_time) }}</span>
                  <span>|</span>
                  <span>📅 截止时间：{{ formatDate(activityDetails[record.activity_id].deadline) }}</span>
                </div>
              </div>
            </div>
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
