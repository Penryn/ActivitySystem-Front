<template>
  <div class="flex flex-col min-h-screen">
    <!-- 顶部导航栏 -->
    <nav class="navbar bg-base-100 shadow-lg fixed top-0 left-0 w-full z-50">
      <div class="container mx-auto flex justify-between items-center px-4">
        <!-- Logo -->
        <div class="flex items-center">
          <a class="btn btn-ghost text-xl font-bold">校园活动平台</a>
        </div>

        <!-- 菜单项 -->
        <div class="hidden md:flex items-center space-x-4">
          <ul class="menu menu-horizontal px-1">
            <li v-show="!loginStore.loginSession">
              <a @click="router.push('/login')">
                <i class="el-icon-user"></i> 登录
              </a>
            </li>
            <li v-show="loginStore.loginSession">
              <a @click="logout">
                <i class="el-icon-switch-button"></i> 登出
              </a>
            </li>
          </ul>
        </div>

        <!-- 移动端菜单（小屏幕） -->
        <div class="md:hidden">
          <button @click="toggleMenu" class="btn btn-ghost">
            <i class="el-icon-menu"></i>
          </button>
        </div>
      </div>

      <!-- 移动端下拉菜单 -->
      <div v-if="isMenuOpen" class="md:hidden bg-base-200 shadow-md absolute top-14 right-4 rounded-lg p-4 w-48">
        <ul class="space-y-2">
          <li v-show="!loginStore.loginSession">
            <a @click="navigate('/login')">登录</a>
          </li>
          <li v-show="loginStore.loginSession">
            <a @click="logout">登出</a>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 页面内容 -->
    <main class="flex-1 mt-16 p-4">
      <router-view/>
    </main>

    <!-- 底部页脚 -->
    <footer class="bg-base-200 text-center py-4 mt-auto shadow-inner">
      <p class="text-sm text-gray-500">
        &copy; Activity System. All rights reserved.
      </p>
      <div class="flex justify-center space-x-4 mt-2">
        <a href="#" class="text-blue-500 hover:underline">前端仓库</a>
        <a href="#" class="text-blue-500 hover:underline">后端仓库</a>
        <a href="#" class="text-blue-500 hover:underline">作者博客</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import { ElNotification } from "element-plus";
import router from "./routers";
import { useMainStore } from "./stores";

const loginStore = useMainStore().useLoginStore();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navigate = (path: string) => {
  router.push(path);
  isMenuOpen.value = false; // 关闭移动端菜单
};

const logout = () => {
  loginStore.setLogin(false);
  ElNotification.success("登出成功");
  router.push("/login");
};
</script>

<style scoped>
/* 移动端菜单的动画 */
@media (max-width: 768px) {
  .md\:hidden {
    display: block;
  }
}
</style>