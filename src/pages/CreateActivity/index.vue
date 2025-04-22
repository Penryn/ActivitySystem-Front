<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMainStore } from '@/stores';
import { createActivityAPI } from '@/apis';
import { ElMessage, ElDatePicker } from 'element-plus';

const router = useRouter();
const userStore = useMainStore().useUserStore();

const formData = ref({
  title: '',
  content: '',
  location: '',
  category: '',
  img: [] as string[],
  deadline: '',
  start_time: ''
});

const categories = [
  { value: '体育运动', label: '体育运动' },
  { value: '学术讲座', label: '学术讲座' },
  { value: '艺术文化', label: '艺术文化' },
  { value: '社交活动', label: '社交活动' },
  { value: '志愿服务', label: '志愿服务' }
];

const handleSubmit = async () => {
  try {
    await createActivityAPI(userStore.userSession.token, formData.value);
    ElMessage.success('活动创建成功');
    router.push('/');
  } catch (error) {
    ElMessage.error('活动创建失败');
    console.error(error);
  }
};

const handleCancel = () => {
  router.push('/');
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-4 md:p-6">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-800">创建新活动</h2>
          <button
            @click="handleCancel"
            class="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- 标题 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">活动标题</label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="请输入活动标题"
            />
          </div>

          <!-- 内容 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">活动内容</label>
            <textarea
              v-model="formData.content"
              required
              rows="4"
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="请输入活动详细内容"
            ></textarea>
          </div>

          <!-- 地点 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">活动地点</label>
            <input
              v-model="formData.location"
              type="text"
              required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              placeholder="请输入活动地点"
            />
          </div>

          <!-- 类别 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">活动类别</label>
            <select
              v-model="formData.category"
              required
              class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white"
            >
              <option value="">请选择活动类别</option>
              <option v-for="category in categories" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>

          <!-- 时间选择器 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- 开始时间 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">开始时间</label>
              <el-date-picker
                v-model="formData.start_time"
                type="datetime"
                placeholder="选择开始时间"
                format="YYYY-MM-DD HH:mm:ss"
                class="w-full"
              />
            </div>

            <!-- 截止时间 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">截止时间</label>
              <el-date-picker
                v-model="formData.deadline"
                type="datetime"
                placeholder="选择截止时间"
                format="YYYY-MM-DD HH:mm:ss"
                class="w-full"
              />
            </div>
          </div>

          <!-- 图片上传 -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">活动图片</label>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors duration-200">
              <div class="flex flex-col items-center justify-center">
                <svg class="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-500">点击或拖拽图片到此处上传</p>
                <p class="text-sm text-gray-400 mt-1">支持 JPG、PNG 格式，大小不超过 5MB</p>
              </div>
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              @click="handleCancel"
              class="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              创建活动
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style>
.el-date-picker {
  width: 100% !important;
}
</style> 