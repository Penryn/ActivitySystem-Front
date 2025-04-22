import loginAPI from "./service/Login/loginAPI"
import regAPI from "./service/Login/regAPI"
import getLatestActivitiesAPI from "@/apis/service/home/getLatestActivities";
import getHottestActivitiesAPI from "@/apis/service/home/getHottestActivities";
import getNewestActivitiesAPI from "@/apis/service/home/getNewestActivities";
import createActivityAPI from "@/apis/service/activity/create";
import getActivityAPI from "@/apis/service/activity/get";
import deleteActivityAPI from "@/apis/service/activity/delete";
import getMineActivitiesAPI from "@/apis/service/activity/getMine";
import getSignUpActivitiesAPI from "@/apis/service/activity/getSignUp";
import signUpActivityAPI from "@/apis/service/activity/signUp";
import cancelSignUpActivityAPI from "@/apis/service/activity/cancelSignUp";
import upvoteActivityAPI from "@/apis/service/activity/upvote";
export {
    loginAPI,
    regAPI,
    getLatestActivitiesAPI,
    getHottestActivitiesAPI,
    getNewestActivitiesAPI,
    createActivityAPI,
    getActivityAPI,
    deleteActivityAPI,
    getMineActivitiesAPI,
    getSignUpActivitiesAPI,
    signUpActivityAPI,
    cancelSignUpActivityAPI,
    upvoteActivityAPI
}