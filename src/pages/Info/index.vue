<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMainStore } from '@/stores';
import getActivityAPI from '@/apis/service/activity/get';
import upvoteActivityAPI from '@/apis/service/activity/upvote';
import signUpActivityAPI from '@/apis/service/activity/signUp';
import cancelSignUpActivityAPI from '@/apis/service/activity/cancelSignUp';
import getSignUpActivitiesAPI from '@/apis/service/activity/getSignUp';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import { ArrowLeft, Star, Location, User, Timer, Check, InfoFilled, Warning, StarFilled } from '@element-plus/icons-vue';

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
    activity: Activity;
    status: boolean;
  };
  msg: string;
}

interface SignUpResponse {
  code: number;
  msg: string;
}

const router = useRouter();
const userStore = useMainStore().useUserStore();
const activityStore = useMainStore().useActivityStore();
const loading = ref(true);
const activity = ref<Activity | null>(null);
const isSignedUp = ref(false);
const loadingSignUp = ref(false);

// 获取活动详情
const fetchActivity = async () => {
  if (!activityStore.currentActivityId) {
    ElMessage.error('活动不存在');
    return;
  }

  try {
    const res = await getActivityAPI(userStore.userSession.token, activityStore.currentActivityId) as ActivityResponse;
    if (res.code === 200) {
      activity.value = res.data.activity;
    } else {
      ElMessage.error('获取活动详情失败');
    }
  } catch (error) {
    ElMessage.error('获取活动详情失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

// 检查是否已报名
const checkSignUpStatus = async () => {
  if (!activity.value) return;
  
  try {
    const res = await getSignUpActivitiesAPI(userStore.userSession.token, 1, 100);
    if (res.code === 200) {
      isSignedUp.value = res.data.record_list.some(record => record.activity_id === activity.value?.ID);
    }
  } catch (error) {
    console.error('获取报名状态失败:', error);
  }
};

// 报名活动
const handleSignUp = async () => {
  if (!activity.value) return;
  
  try {
    loadingSignUp.value = true;
    const res = await signUpActivityAPI(userStore.userSession.token, activity.value.ID) as SignUpResponse;
    if (res.code === 200) {
      isSignedUp.value = true;
      ElMessage.success('报名成功');
    } else {
      ElMessage.error('报名失败');
    }
  } catch (error) {
    ElMessage.error('报名失败');
    console.error(error);
  } finally {
    loadingSignUp.value = false;
  }
};

// 取消报名
const handleCancelSignUp = async () => {
  if (!activity.value) return;
  
  try {
    await ElMessageBox.confirm('确定要取消报名该活动吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    
    loadingSignUp.value = true;
    const res = await cancelSignUpActivityAPI(userStore.userSession.token, activity.value.ID) as SignUpResponse;
    if (res.code === 200) {
      isSignedUp.value = false;
      ElMessage.success('取消报名成功');
    } else {
      ElMessage.error('取消报名失败');
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('取消报名失败');
      console.error(error);
    }
  } finally {
    loadingSignUp.value = false;
  }
};

// 点赞活动
const handleUpvote = async () => {
  if (!activity.value) return;
  
  try {
    const res = await upvoteActivityAPI(userStore.userSession.token, activity.value.ID) as SignUpResponse;
    if (res.code === 200) {
      activity.value.upvote += 1;
      ElMessage.success('点赞成功');
    } else {
      ElMessage.error('点赞失败');
    }
  } catch (error) {
    ElMessage.error('点赞失败');
    console.error(error);
  }
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

// 获取活动状态
const getActivityStatus = (activity: Activity) => {
  const now = new Date();
  const startTime = new Date(activity.start_time);
  const deadline = new Date(activity.deadline);

  if (now < startTime) return '未开始';
  if (now > deadline) return '已结束';
  return '进行中';
};

// 获取分类标签类型
const getCategoryType = (category: string) => {
  const types: Record<string, string> = {
    '体育': 'success',
    '文化': 'warning',
    '艺术': 'danger',
    '科技': 'info',
    '其他': ''
  };
  return types[category] || '';
};

onMounted(async () => {
  await fetchActivity();
  await checkSignUpStatus();
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6">
    <div class="max-w-4xl mx-auto">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <!-- 返回按钮 -->
        <div class="mb-6">
          <el-button @click="router.back()" class="flex items-center gap-2">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>

        <!-- 活动详情 -->
        <div v-else-if="activity" class="space-y-8">
          <!-- 标题和基本信息 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <h1 class="text-3xl font-bold text-gray-800">{{ activity.title }}</h1>
              <div class="flex items-center gap-4">
                <el-tag :type="getCategoryType(activity.category)" size="large">
                  {{ activity.category }}
                </el-tag>
                <el-button 
                  type="primary" 
                  class="flex items-center gap-2"
                  @click="handleUpvote"
                >
                  <el-icon><StarFilled /></el-icon>
                  <span>点赞 {{ activity.upvote }}</span>
                </el-button>
                <el-button
                  :type="isSignedUp ? 'danger' : 'success'"
                  :loading="loadingSignUp"
                  @click="isSignedUp ? handleCancelSignUp() : handleSignUp()"
                >
                  {{ isSignedUp ? '取消报名' : '立即报名' }}
                </el-button>
              </div>
            </div>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <div class="flex items-center gap-1">
                <el-icon><Location /></el-icon>
                <span>{{ activity.location }}</span>
              </div>
              <div class="flex items-center gap-1">
                <el-icon><User /></el-icon>
                <span>发布者：{{ activity.user_id }}</span>
              </div>
            </div>
          </div>

          <!-- 活动图片 -->
          <div v-if="activity.img" class="rounded-xl overflow-hidden shadow-lg">
            <img :src="activity.img" :alt="activity.title" class="w-full h-96 object-cover hover:scale-105 transition-transform duration-300" />
          </div>

          <!-- 活动内容 -->
          <div class="prose max-w-none bg-gray-50 p-6 rounded-xl">
            <h3 class="text-xl font-semibold text-gray-800 mb-4">活动详情</h3>
            <p class="text-gray-600 whitespace-pre-line leading-relaxed">{{ activity.content }}</p>
          </div>

          <!-- 时间信息 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">时间安排</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <el-icon class="text-indigo-600"><Timer /></el-icon>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">开始时间</p>
                    <p class="text-gray-800 font-medium">{{ formatDate(activity.start_time) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-red-100 rounded-lg">
                    <el-icon class="text-red-600"><Timer /></el-icon>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">截止时间</p>
                    <p class="text-gray-800 font-medium">{{ formatDate(activity.deadline) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 class="text-lg font-semibold text-gray-800 mb-4">活动状态</h3>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-green-100 rounded-lg">
                    <el-icon class="text-green-600"><Check /></el-icon>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">活动状态</p>
                    <p class="text-gray-800 font-medium">{{ getActivityStatus(activity) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-100 rounded-lg">
                    <el-icon class="text-blue-600"><InfoFilled /></el-icon>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500">创建时间</p>
                    <p class="text-gray-800 font-medium">{{ formatDate(activity.CreatedAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else class="text-center py-8">
          <div class="text-gray-400 mb-4">
            <el-icon class="text-6xl"><Warning /></el-icon>
          </div>
          <p class="text-gray-500">活动不存在或已被删除</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose {
  max-width: none;
}

:deep(.el-tag) {
  @apply text-base;
}
</style>
