import { request } from "@/apis/axios";



const signUpActivityAPI = (token: string, id: number) => {
  return request("/api/student/activity/signUp", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      Activity_id: id
    }
  });
};

export default signUpActivityAPI;