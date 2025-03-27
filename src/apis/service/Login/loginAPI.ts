import { request } from "../../axios";


const loginAPI = (data: {
    stu_id: string,
    password: string
}) => {
    return request("/api/user/login", {
        data: data,
        method: "POST",
    });
};

export default loginAPI;