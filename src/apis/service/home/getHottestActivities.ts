import { request } from "@/apis/axios";


const getHottestActivitiesAPI = (token:string) => {
    return request("/api/student/activity/hottest", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export default getHottestActivitiesAPI;