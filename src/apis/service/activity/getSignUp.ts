import { request } from "@/apis/axios";

interface SignUpRecord {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  user_id: number;
  activity_id: number;
}

interface SignUpResponse {
  code: number;
  data: {
    num: number;
    record_list: SignUpRecord[];
  };
  msg: string;
}

const getSignUpActivitiesAPI = (
  token: string,
  page_num: number = 1,
  page_size: number = 10
): Promise<SignUpResponse> => {
  return request("/api/student/activity/signUp", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page_num,
      page_size
    }
  }) as Promise<SignUpResponse>;
};

export default getSignUpActivitiesAPI;