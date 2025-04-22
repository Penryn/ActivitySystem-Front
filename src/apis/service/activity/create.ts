import { request } from "@/apis/axios";

interface CreateActivityData {
  title: string;
  content: string;
  location: string;
  category: string;
  img: string[];
  deadline: string;
  start_time: string;
}

const createActivityAPI = (token: string, data: CreateActivityData) => {
  return request("/api/student/activity", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      
    },
    data: data
  });
};

export default createActivityAPI;