import React, { useEffect, useState } from "react";
import { Card } from "../../../components/cards/card";
import { useNavigate } from "react-router-dom";
import { Menu } from "../../../components/menu/menu";
import "./register.css";
import { Header } from "../../../components/header/header";
import { ValidateToken, GetUserData, Logout } from "../../../services/calls";

function RegisterUser() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([])
    console.log("minhas permissões", userPermissions)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserPermissions(result.availableServices.filter(e => e.service_name.includes("User"))[0])
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

                                </div>

                                : ""}


                            <div className="initialContainer">
                                <h3>Preencha todos os dados</h3>
                            </div>

                            <div className="registerContainer">


                            </div>

                        </>

                    )}



                </div>
            </div>
        </div>
    );
}

export default RegisterUser;