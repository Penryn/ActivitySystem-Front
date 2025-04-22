<script setup lang="ts">
import { ref } from 'vue';

const searchText = ref('');
const selectedType = ref('');

const activityTypes = [
  { value: '', label: '全部类型' },
  { value: '体育运动', label: '体育运动' },
  { value: '学术讲座', label: '学术讲座' },
  { value: '艺术文化', label: '艺术文化' },
  { value: '社交活动', label: '社交活动' },
  { value: '志愿服务', label: '志愿服务' }
];

const emit = defineEmits(['search', 'filter']);

const handleSearch = () => {
  emit('search', searchText.value);
};

const handleFilter = () => {
  emit('filter', selectedType.value);
};
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
    <div class="flex flex-col md:flex-row gap-4">
      <!-- 搜索框 -->
      <div class="flex-1">
        <div class="relative">
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索活动标题..."
            class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            @input="handleSearch"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- 筛选下拉框 -->
      <div class="md:w-48">
        <select
          v-model="selectedType"
          class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          @change="handleFilter"
        >
          <option v-for="type in activityTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template> 