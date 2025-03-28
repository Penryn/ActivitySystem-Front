<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div
            class="relative bg-white shadow-lg rounded-lg w-full sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4 px-6 py-8 flex flex-col items-center transform transition-all duration-300 hover:shadow-xl max-w-md">
            <div class="mb-4">
                <!-- 这里可以放置网站logo -->
                <img src="../assets/logo.png" alt="Logo" class="h-16 w-auto" v-if="false" />
            </div>
            <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">用户注册</h2>

            <el-form ref="formRef" :model="registerForm" :rules="rules" class="w-full space-y-4">
                <!-- 用户名 -->
                <el-form-item prop="username" class="mb-0">
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" class="rounded-md shadow-sm">
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 学号 -->
                <el-form-item prop="stu_id" class="mb-0">
                    <el-input v-model="registerForm.stu_id" placeholder="请输入学号" class="rounded-md shadow-sm">
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <Ticket />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop="password" class="mb-0">
                    <el-input v-model="registerForm.password" type="password" show-password placeholder="请输入密码"
                        class="rounded-md shadow-sm">
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 确认密码 -->
                <el-form-item prop="confirmPassword" class="mb-0">
                    <el-input v-model="registerForm.confirmPassword" type="password" show-password placeholder="请再次输入密码"
                        class="rounded-md shadow-sm">
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <Check />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 邮箱 -->
                <el-form-item prop="email" class="mb-0">
                    <el-input v-model="registerForm.email" placeholder="请输入邮箱" class="rounded-md shadow-sm">
                        <template #prefix>
                            <el-icon class="text-gray-400">
                                <Message />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <div class="w-full flex justify-end mt-2">
                    <button type="button" @click="goToLogin"
                        class="text-blue-500 hover:text-blue-700 group relative overflow-hidden py-2 px-4 rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50">
                        <span class="relative z-10 flex items-center group-hover:translate-x-1 transition-transform duration-300 ease-in-out">
                            返回登录
                            <el-icon class="ml-1 group-hover:translate-x-1 transition-transform duration-300 ease-in-out">
                                <ArrowRight />
                            </el-icon>
                        </span>
                        <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300 ease-out"></span>
                    </button>
                </div>

                <div class="flex justify-center gap-4 w-full pt-4">
                    <button @click="handleRegister"
                        class="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md shadow-sm transform transition-all duration-200 hover:translate-y-[-2px] hover:shadow-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        :class="{ 'opacity-75 cursor-wait': loading }" :disabled="loading">
                        <template v-if="!loading">
                            <el-icon class="mr-1">
                                <UserFilled />
                            </el-icon>
                            <span>注册</span>
                        </template>
                        <template v-else>
                            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            <span>注册中...</span>
                        </template>
                    </button>
                    <button @click="resetForm"
                        class="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-md shadow-sm transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50">
                        <el-icon class="mr-1">
                            <Delete />
                        </el-icon>
                        <span>清空</span>
                    </button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useRequest } from "vue-hooks-plus"
import { regAPI } from "@/apis"
import { ElNotification, ElMessage, FormInstance } from 'element-plus'
import {
    User,
    Lock,
    Check,
    Message,
    Delete,
    ArrowRight,
    UserFilled,
    Ticket
} from '@element-plus/icons-vue';

const router = useRouter()
const loading = ref(false)
const formRef = ref<FormInstance>()

// 注册表单数据
const registerForm = reactive({
    stu_id: '',
    password: '',
    confirmPassword: '',
    username: '',
    email: ''
})

// 表单验证规则
const rules = {
    stu_id: [
        { required: true, message: '请输入学号', trigger: 'blur' },
        { min: 12, max: 12, message: '学号长度应有12位数字构成', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '学号应为数字', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6到20个字符之间', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { 
            validator: (rule: any, value: string, callback: any) => {
                if (value !== registerForm.password) {
                    callback(new Error('两次输入的密码不一致'))
                } else {
                    callback()
                }
            }, 
            trigger: 'blur' 
        }
    ],
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
    ],
    email: [
        { required: false, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ]
}

// 处理注册
const handleRegister = () => {
    formRef.value?.validate((valid) => {
        if (!valid) {
            ElNotification({
                title: '注册失败',
                message: '请填写完整的注册信息',
                type: 'error',
            });
            return;
        }

        loading.value = true;

        useRequest(() => regAPI({
            stu_id: registerForm.stu_id,
            password: registerForm.password,
            username: registerForm.username,
            email: registerForm.email
        }), {
            onSuccess(res: any) {
                loading.value = false;

                if (res.code === 200) {
                    ElNotification({
                        title: '注册成功',
                        message: '请使用新账号登录系统',
                        type: 'success',
                    });
                    router.push('/login')
                } else {
                    ElNotification({
                        title: '注册失败',
                        message: res.msg || '请检查您的输入并重试',
                        type: 'error',
                    });
                }
            },
            onError(error: any) {
                loading.value = false;
                ElNotification({
                    title: '注册失败',
                    message: '网络错误，请稍后重试',
                    type: 'error',
                });
                console.error('注册失败:', error);
            }
        })
    });
}

// 重置表单
const resetForm = () => {
    formRef.value?.resetFields();
};

// 跳转到登录页
const goToLogin = () => {
    router.push('/login')
}
</script>

<style scoped>
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.relative {
    animation: fadeIn 0.5s ease-out;
}
</style>
