import React, { useEffect, useState } from "react";
import { Card } from "../../components/cards/card";
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/menu/menu";
import "./permission.css";
import api from "../../services/api";
import { Header } from "../../components/header/header";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

import { ValidateToken, GetUserData, Logout } from "../../services/calls";
import { PermissionsTable } from "../../components/tables/table";

function Permission() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([])
    const [permissionsData, setPermissionsData] = useState([])


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserPermissions(result.availableServices.filter(e => e.service_name.includes("Permission"))[0])
                    getPermissionsData(result.availableServices.filter(e => e.service_name.includes("Permission"))[0])
                }
            } catch (err) {
                setError(err.message || 'An error occurred');
            } finally {
                setLoading(false); // Dados carregados, então setar como false
            }
        };

        const checkData = async () => {
            try {
                const result = await ValidateToken();
                if (result.status !== 1) {
                    const clearSession = await Logout();
                    if (clearSession.status === 1) {
                        navigate("/");
                    }
                }
            } catch (err) {
                setError(err.message || 'An error occurred during token validation');
            }
        };

        loadData();
        checkData();
    }, [navigate]);

    async function getPermissionsData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

        try {
            const request = await api.post('api/permission/getPermissionsData', { data });
            if (request.data.status === 1) {
                setPermissionsData(request.data?.permissionData || []);
            } else {
                setError('Failed to load data');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <div className="container flex">
            <Menu data={userDataAvailable} />
            <div className="content">
                <Header data={userData} />
                <div className="maxWidth">
                    {loading ? (
                        <div className="initialContainer"><h3>Carregando...</h3></div> // Exibindo um indicador de carregamento
                    ) : error ? (
                        <div className="initialContainer"><h3>Erro: {error}</h3></div> // Exibindo mensagem de erro, se houver
                    ) : (
                        <>
                            {userPermissions.register_right === 1 ?
                                <div className="registerButtonContainer">
                                    <button className="registerButton" onClick={(() => navigate('/user/register'))}>
                                        <PersonAddRoundedIcon />
                                        <p>Nova Permissão</p>
                                    </button>
                                </div>

                                : ""}
                            <PermissionsTable permissionsData={permissionsData} />
                            <Card />

                        </>

                    )}


                </div>
            </div>
        </div>
    );
}

export default Permission;