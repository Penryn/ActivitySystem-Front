<template>
    <div class="block text-center">
        <span class="text-gray-500 mb-5 block">近期最快举办的活动</span>
        <el-carousel height="450px" motion-blur>
            <el-carousel-item v-for="item in latestActivitiesList" :key="item" class="flex justify-center items-center relative cursor-pointer"
                @click="goToActivityDetail(item.ID)">
                <img :src="item.img" alt="Activity Image" class="w-full h-full object-cover" />
                <div class="absolute bottom-0 left-0 right-0 bg-black/50 p-6 text-white">
                    <h3 class="text-2xl font-bold mb-2">{{ item.title }}</h3>
                    <div class="mt-2 flex justify-between items-center">
                        <span class="text-sm">开始时间：{{ formatDateTime(item.start_time) }}</span>
                        <span class="text-sm">地点：{{ item.location }}</span>
                    </div>
                </div>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script setup lang="ts">
import { getLatestActivitiesAPI } from "@/apis";
import {useRequest} from "vue-hooks-plus";
import {ref} from "vue";
import { useMainStore } from "@/stores";
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useMainStore().useUserStore();
const activityStore = useMainStore().useActivityStore();

const latestActivitiesList = ref<any[]>([]);

const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

const getLatestActivitiesList = () => {
  useRequest(() => getLatestActivitiesAPI (userStore.userSession.token), {
    onSuccess(res: any) {
      if(res.code === 200) {
        latestActivitiesList.value = res.data.Activity_list;
      }
    },
  })
}
getLatestActivitiesList();

// 跳转到活动详情页
const goToActivityDetail = (activityId: number) => {
  activityStore.setCurrentActivityId(activityId);
  router.push('/user/info');
};
</script>

<style scoped>
.el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
}
</style>