<template>
  <div class="flex justify-center items-center h-screen bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-8 w-full sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4">
      <h2 class="text-3xl font-bold mb-10 text-center">用户登录</h2>
      <el-input v-model="username" placeholder="请输入用户名" prefix-icon="User" class="mb-4"/>
      <el-input v-model="password" type="password" show-password placeholder="请输入密码" prefix-icon="Lock"
                class="mb-4"/>
      <div class="flex justify-center gap-8 mt-10">
        <el-button type="primary" @click="login" icon="Search">登录</el-button>
        <el-button @click="clean" icon="Delete">清空</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import loginService from "../apis/loginService";
import loginStore from "../stores/loginStore";
import userStore from "../stores/userStore";
import {ElMessage} from 'element-plus'
import router from "../routers";

const username = ref("");
const password = ref("");
const newLoginStore = loginStore();
const newUserStore = userStore();

const loginSuccess = () => {
  ElMessage({
    message: '登录成功',
    type: 'success',
    plain: true,
  })
}
const loginError = () => {
  ElMessage({
    message: '登录失败',
    type: 'error',
    plain: true,
  })
}

const login = async () => {
  const loginInfo = {
    username: username.value,
    password: password.value,
  };

  const response = await loginService.login(loginInfo);
  if (response.status === 200 && response.data.code === 200){
    newLoginStore.setLogin(true);
    newUserStore.setUserInfo({
      username: username.value,
      password: password.value,
      token: response.data.data.token,
      email: response.data.data.email,
      stu_id: response.data.data.stu_id,
      avatar: response.data.data.avatar,
      profile: response.data.data.profile,
    });
    loginSuccess();
    await router.push({path: '/home'});
  } else {
    loginError();
  }
}

const clean = () => {
  username.value = "";
  password.value = "";
};
</script>
