<script setup lang="ts">
import carousel from "../../components/carousel.vue";
import leaderboard from "../../components/leaderboard.vue";
import Typewriter from "../../components/Typewriter.vue";
import SearchFilter from "../../components/SearchFilter.vue";
import ActivityList from "../../components/ActivityList.vue";
import { ref, onMounted } from 'vue';

const currentDate = ref(new Date().toLocaleDateString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));

const quotes = [
  "生活就像一场冒险，每一次活动都是新的开始",
  "在校园里，每个角落都藏着无限可能",
  "参与活动，让青春绽放光彩",
  "发现兴趣，结交朋友，丰富生活",
  "每一次参与都是成长的机会",
  "让校园生活充满活力与色彩"
];

const currentQuote = ref('');

const getRandomQuote = () => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote.value = quotes[randomIndex];
};

onMounted(() => {
  getRandomQuote();
});

const searchText = ref('');
const filterType = ref('');

const handleSearch = (text: string) => {
  searchText.value = text;
};

const handleFilter = (type: string) => {
  filterType.value = type;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-3 md:p-4">
    <!-- 欢迎区域 -->
    <div class="mb-4">
      <div class="max-w-4xl mx-auto">
        <div class="flex justify-between items-start">
          <div class="max-w-2xl">
            <p class="text-gray-700 text-base leading-relaxed">
              <Typewriter :text="currentQuote" :speed="150" :delay="3000" />
            </p>
          </div>
          <div class="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg shadow-sm border border-gray-100">
            {{ currentDate }}
          </div>
        </div>
        <div class="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="space-y-6">
      <!-- 轮播图和排行榜 -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- 轮播图 -->
        <div class="flex-1 bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
          <div class="flex items-center mb-6">
            <h2 class="text-lg font-medium text-gray-800">近期活动</h2>
            <div class="h-0.5 flex-1 ml-4 bg-gray-100 rounded"></div>
          </div>
          <carousel />
        </div>

        <!-- 排行榜 -->
        <div class="md:w-[400px] bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
          <div class="flex items-center mb-6">
            <h2 class="text-lg font-medium text-gray-800">热门排行榜</h2>
            <div class="h-0.5 flex-1 ml-4 bg-gray-100 rounded"></div>
          </div>
          <div class="rounded-xl overflow-hidden">
            <leaderboard />
          </div>
        </div>
      </div>

      <!-- 搜索和活动列表 -->
      <div class="max-w-4xl mx-auto space-y-4">
        <SearchFilter @search="handleSearch" @filter="handleFilter" />
        <ActivityList :search-text="searchText" :filter-type="filterType" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 移除旧的样式，因为我们已经使用 Tailwind 类替代 */
</style>