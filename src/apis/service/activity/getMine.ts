import { request } from "@/apis/axios";

interface Activity {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  title: string;
  content: string;
  location: string;
  category: string;
  user_id: number;
  upvote: number;
  img: string;
  deadline: string;
  start_time: string;
}

interface ActivityResponse {
  code: number;
  data: {
    Activity_list: Activity[];
  };
  msg: string;
}

const getMineActivitiesAPI = (
  token: string,
  page_num: number = 1,
  page_size: number = 10
): Promise<ActivityResponse> => {
  return request("/api/student/activity/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page_num,
      page_size
    }
  }) as Promise<ActivityResponse>;
};

export default getMineActivitiesAPI;