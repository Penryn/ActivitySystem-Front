<script setup lang="ts">
import carousel from "../../components/carousel.vue";
import leaderboard from "../../components/leaderboard.vue";
import { ref } from 'vue';

const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <!-- 欢迎区域 -->
    <div class="text-center mb-10 pb-6 border-b border-gray-200 relative">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">欢迎来到学习平台</h1>
      <p class="text-lg text-gray-600 mb-4">探索知识，追求卓越</p>
      <div class="absolute top-0 right-0 bg-blue-50 text-gray-500 text-sm px-4 py-2 rounded-full">
        {{ currentDate }}
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="flex flex-col md:flex-row gap-6">
      <!-- 主内容区 -->
      <div class="flex-1 bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:-translate-y-1">
        <div class="flex items-center mb-6">
          <h2 class="text-xl font-semibold text-blue-500">热门课程</h2>
          <div class="h-0.5 flex-1 ml-4 bg-gradient-to-r from-blue-500 to-blue-50 rounded"></div>
        </div>
        <carousel />
      </div>

      <!-- 侧边栏 -->
      <div class="md:w-96 bg-white rounded-xl shadow-md p-6 transition-transform duration-300 hover:-translate-y-1">
        <div class="flex items-center mb-6">
          <h2 class="text-xl font-semibold text-blue-500">学习排行榜</h2>
          <div class="h-0.5 flex-1 ml-4 bg-gradient-to-r from-blue-500 to-blue-50 rounded"></div>
        </div>
        <div class="rounded-lg overflow-hidden">
          <leaderboard />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.welcome-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eaeaea;
  position: relative;
}

.main-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.subtitle {
  font-size: 1.2rem;
  color: #5a6a7e;
  margin-bottom: 1rem;
}

.date-display {
  font-size: 0.9rem;
  color: #909399;
  position: absolute;
  right: 0;
  top: 0;
  background-color: #e6f1fc;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.main-content {
  flex: 1;
  min-width: 300px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.main-content:hover {
  transform: translateY(-5px);
}

.sidebar-content {
  width: 350px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.3s ease;
}

.sidebar-content:hover {
  transform: translateY(-5px);
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.4rem;
  color: #409EFF;
  margin: 0;
  font-weight: 600;
}

.decoration-line {
  height: 3px;
  background: linear-gradient(90deg, #409EFF 0%, rgba(64, 158, 255, 0.1) 100%);
  flex: 1;
  margin-left: 1rem;
  border-radius: 3px;
}

.leaderboard-wrapper {
  border-radius: 8px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .sidebar-content {
    width: 100%;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .home-container {
    padding: 1rem;
  }
}
</style>