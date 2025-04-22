import { request } from "@/apis/axios";


const getActivityAPI = (token: string, id: number) => {
  return request("/api/student/activity", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      activity_id: id
    }
  });
};

export default getActivityAPI;