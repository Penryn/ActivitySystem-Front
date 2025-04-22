import { request } from "@/apis/axios";


const getLatestActivitiesAPI = (token :string) => {
    return request("/api/student/activity/newest", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

export default getLatestActivitiesAPI;