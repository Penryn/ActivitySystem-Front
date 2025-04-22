import { request } from "@/apis/axios";



const deleteActivityAPI = (token: string, id: number) => {
  return request("/api/student/activity", {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      Activity_id: id
    }
  });
};

export default deleteActivityAPI;