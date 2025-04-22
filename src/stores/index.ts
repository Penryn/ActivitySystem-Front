import { defineStore } from 'pinia'
import useLoginStore from './service/loginStore'
import useUserStore from './service/userStore'
import useActivityStore from './service/activity'

export const useMainStore = defineStore(
    'main',
    () => {
        return {
            useLoginStore,
            useUserStore,
            useActivityStore
        }
    },
    { persist: true }
)
