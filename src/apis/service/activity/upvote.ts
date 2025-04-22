import { request } from "@/apis/axios";



const upvoteActivityAPI = (token: string, id: number) => {
  return request("/api/student/activity/upvote", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      activity_id: id
    }
  });
};

export default upvoteActivityAPI;