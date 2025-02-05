import api from "./api.js";


// retorna a informação de um usuário específico.
export const GetUserData = async () => {
    try {
        const response = await api.post('api/user/getUserData');

        return response.data.data[0];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};
// retorna a informação de um usuário pelo ID 
export const GetUserDataById = async (id) => {
    try {
        const response = await api.post('api/user/getUserDataById', {
            user_id: id
        });

        return response.data.data[0];
    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
}
// retorna a lista de todos os usuários existentes
export const GetUsersData = async (permissionInfo, setLoading, setUsersData, setError) => {
    setLoading(true);

    const data = permissionInfo

    try {
        const request = await api.post('api/user/getUsersData', { data });
        if (request.data.status === 1) {
            setUsersData(request.data?.usersData || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
//edita um usuário
export const EditUserData = async () => {
}
// cria um novo usuário
export const RegisterUserData = async ( setLoading, user, setSucess, setError) => {
    setLoading(true);
    const data = user

    try {
        const request = await api.post('api/user/register', { data });
        if (request.data.status === 1) {
            setSucess(request.data.message)
        } else {
            setError(request.data.message);
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

// retorna a lista de permissões existentes
export const GetPermissionsData = async (permissionInfo, setLoading, setPermissionData, setError) => {
    setLoading(true);
    const data = permissionInfo
    try {
        const request = await api.post('api/permission/getPermissionsData', { data });
        if (request.data.status === 1) {
            setPermissionData(request.data?.permissionData || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}

// retorna a lista de serviços existentes.
export const GetServicesData = async () => {}

// registra uma permissão em um serviço
export const RegisterServicePermission = async () => {}


// retorna a lista de canais motv
export const GetChannelsData = async (dataAvailableWithConcat, setLoading, setChannels, setError) => {
    setLoading(true);
    const data = dataAvailableWithConcat

    try {
        const request = await api.post('api/channel/getChannelsData', { data });
        if (request.data.status === 1) {
            setChannels(request.data?.channelsData || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
// retorna a lista de vods motv
export const GetVodsData = async (dataAvailableWithConcat, setLoading, setVods, setError) => {
    setLoading(true);

    const data = dataAvailableWithConcat

    try {
        const request = await api.post('api/vod/getVodsData', { data });
        if (request.data.status === 1) {
            setVods(request.data?.vodsData || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
// retorna a lista de dealers motv
export const GetDealerData = async (dataAvailable, setLoading, setDealers, setError) => {
    setLoading(true);
    const data = dataAvailable

    try {
        const request = await api.post('api/dealer/getDealersData', { data });
        if (request.data.status === 1) {
            setDealers(request.data?.data[0].dealersInfo || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}
//retorna a lista de produtos vinculados ao dealer motv
export const GetWhitelistProductsData = async (dataAvailable, setLoading, setProducts, setError) => {
    setLoading(true);
    const data = dataAvailable

    try {
        const request = await api.post('api/product/getWhitelistProductsData', { data });
        if (request.data.status === 1) {
            //console.log("o req product", request.data?.productsInfo.rows)
            setProducts(request.data?.productsInfo.rows || []);
        } else {
            setError('Failed to load data');
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
}


//valida o token do usuário logado
export const ValidateToken = async () => {
    try {
        const request = await api.post('api/auth/validateToken', {})
        return request.data

    } catch (error) {
        console.error('Failed to fetch data:', error);
        throw error;
    }
};
//envia a tentativa de login
export const SendLogin = async (user, setLoading, navigate, setError) => {
    setLoading(true);
        
    try {
        const request = await api.post('api/auth/login', {user})
        if(request.data.status === 1) {
            setLoading(false);
            navigate("/dashboard");
        } else {
            setError(request.data.message);
            setLoading(false);
        }

    } catch (error) {
        setError(error);
        setLoading(false);
    }
}
//faz logout da aplicação.
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