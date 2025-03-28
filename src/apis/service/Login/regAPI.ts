import { request } from "../../axios";


const regAPI = (data: {
    username: string,
    stu_id: string,
    email: string,
    password: string
}) => {
    return request("/api/user/reg", {
        data: data,
        method: "POST",
    });
};

export default regAPI;