<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <div
        class="relative bg-white shadow-md rounded-lg w-full sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 px-6 py-8 flex flex-col items-center">
      <h2 class="text-2xl font-bold mb-6 text-center">用户登录</h2>
      <el-input v-model="username" placeholder="请输入用户名" prefix-icon="User" class="w-full mb-4"/>
      <el-input v-model="password" type="password" show-password placeholder="请输入密码" prefix-icon="Lock"
                class="w-full mb-6"/>
      <div class="flex justify-center gap-4 w-full">
        <el-button type="primary" @click="login" icon="Search" class="w-1/2">登录</el-button>
        <el-button @click="clean" icon="Delete" class="w-1/2">清空</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {loginAPI} from "../apis";
import {useMainStore} from "@/stores";
import {useRequest} from "vue-hooks-plus";
import {ElNotification} from 'element-plus'
import router from "../routers";

const username = ref("");
const password = ref("");
const loginStore = useMainStore().useLoginStore();
const userStore = useMainStore().useUserStore();


const login = () => {
  useRequest(() => loginAPI({
    username:username.value,
    password:password.value
  }),{
    onSuccess(res: any){
      if(res.code === 200) {
        console.log(res)
        ElNotification.success('登陆成功');
        loginStore.setLogin(true)
        userStore.setUserInfo({
          username: username.value,
          password: password.value,
          token: res.data.token,
          email: res.data.email,
          stu_id: res.data.stu_id,
          avatar: res.data.avatar,
          profile: res.data.profile,
        });
        router.push('/home')
      }else{
        ElNotification.error(res.msg);
      }
    },
    onError(e){
      ElNotification.error('登录失败，请重试' + e);
    },
  })
}

const clean = () => {
  username.value = "";
  password.value = "";
};
</script>

<style scoped>
/* 保证卡片在不同大小下不会过大或者过小 */
.relative {
  max-width: 400px;
  width: 90%;
  transition: all 0.3s ease-in-out;
}

@media (max-width: 640px) {
  .relative {
    width: 100%;
    padding: 20px;
  }
}

@media (min-width: 1024px) {
  .relative {
    padding: 40px;
  }
}
</style>