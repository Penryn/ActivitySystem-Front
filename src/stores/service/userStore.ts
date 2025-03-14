import {defineStore} from "pinia";
import {reactive} from "vue";
import type {userInfo} from "../../types/user.ts";

const userStore = defineStore(
    "user",
    () => {
        const userSession = reactive({
            token:"",
            username: "未登录",
            password: "",
            email:"",
            avatar:"",
            profile:"",
        });

        const setUserInfo = (info: userInfo) : void => {
            userSession.token = info.token;
            userSession.username = info.username;
            userSession.password = info.password;
            userSession.email = info.email;
            userSession.avatar = info.avatar;
            userSession.profile = info.profile;
        };

        return {
            userSession,
            setUserInfo,
        };
    },
    {
        persist: true
    }
);

export default userStore;