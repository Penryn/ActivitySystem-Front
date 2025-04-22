import { request } from "@/apis/axios";



const cancelSignUpActivityAPI = (token: string, id: number) => {
  return request("/api/student/activity/signUp/cancel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      Activity_id: id
    }
  });
};

export default cancelSignUpActivityAPI;