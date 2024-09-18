import api from "./api.js";


export const GetUserData = async () => {
    try {
        const response = await api.post('api/user/getUserData');

        return response.data.data[0];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};


export const ValidateToken = async () => {
    try {
        const request = await api.post('api/auth/validateToken', {})
        console.log("request", request.data)
        return request.data

    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};


export const Logout = async () => {
    try {
        const request = await api.post('api/auth/logout', {})
        if(request.data.status === 1) {
            return request.data
        }


    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};