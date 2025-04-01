<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div class="max-w-7xl mx-auto flex items-center h-16 px-4 sm:px-6">
        <!-- 左侧标题 -->
        <div class="flex items-center pr-6 cursor-pointer" @click="router.push('/home')">
          <h1
            class="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 whitespace-nowrap">
            校园活动平台
          </h1>
        </div>

        <!-- 中间区域占位 -->
        <div class="flex-grow"></div>


        <!-- 右侧导航菜单 -->
        <div class="flex items-center space-x-4" v-if="loginStore.loginSession">
          <el-menu class="border-b-0" mode="horizontal" :ellipsis="false" :router="true">
            <el-menu-item index="/activity/create">
              <el-icon class="mr-1">
                <Plus />
              </el-icon>
              <span>新增活动</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title><el-avatar :size="36" :src="userStore.userSession.avatar" /></template>
              <el-menu-item index="user/activities"><el-icon>
                  <List />
                </el-icon>
                <span class="ml-1">我的活动</span></el-menu-item>
              <el-menu-item index="/user/signUps"> <el-icon>
                  <Tickets />
                </el-icon>
                <span class="ml-1">我的报名记录</span></el-menu-item>
              <el-menu-item @click="logout"> <el-icon>
                  <SwitchButton />
                </el-icon>
                <span class="ml-1">注销登录</span></el-menu-item>
            </el-sub-menu>
          </el-menu>

        </div>
      </div>
    </header>

    <!-- 页面内容 -->
    <main class="flex-1 mt-16 p-6 max-w-7xl w-full mx-auto">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 底部页脚 -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto text-center py-6 px-4">
        <p class="text-sm text-gray-500 mb-3">
          &copy; {{ new Date().getFullYear() }} 校园活动平台. 版权所有
        </p>
        <div class="flex justify-center gap-6">
          <a href="#" class="text-blue-600 hover:text-blue-500 text-sm flex items-center gap-1 transition-colors">
            <el-icon>
              <Document />
            </el-icon>
            <span>前端仓库</span>
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-500 text-sm flex items-center gap-1 transition-colors">
            <el-icon>
              <Connection />
            </el-icon>
            <span>后端仓库</span>
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-500 text-sm flex items-center gap-1 transition-colors">
            <el-icon>
              <User />
            </el-icon>
            <span>作者博客</span>
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElNotification } from "element-plus";
import router from "@/routers";
import { useMainStore } from "@/stores";
import {
  Document,
  Connection,
  User,
  Plus,
  List,
  Tickets,
  SwitchButton
} from '@element-plus/icons-vue';


const loginStore = useMainStore().useLoginStore();
const userStore = useMainStore().useUserStore();

// 用户登出
const logout = () => {
  loginStore.setLogin(false);
  ElNotification.success("登出成功");
  router.push("/login");
};

</script>

<style scoped>
/* 页面过渡动画 - 这部分保留因为Tailwind不直接支持Vue过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 深度选择器用于Element Plus菜单样式 */
.el-menu :deep(.el-menu-item),
.el-menu :deep(.el-sub-menu__title) {
  @apply flex items-center text-sm h-16 leading-[4rem];
}

.el-menu :deep(.el-menu-item.is-active) {
  @apply text-blue-600 font-medium;
}

.el-menu :deep(.el-icon) {
  @apply mr-1;
}
</style>