import React, { useEffect, useState } from "react";
import { Card } from "../../../components/cards/card";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Menu } from "../../../components/menu/menu";
import "./register.css";
import { Header } from "../../../components/header/header";

import { ValidateToken, GetUserData, Logout } from "../../../services/calls";

function RegisterPermission() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [sucess, setSucess] = useState('');
    const [permission, setPermission] = useState({
        name: ""
    })

    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([])
    //console.log("minhas permissões", userPermissions)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserPermissions(result.availableServices.filter(e => e.service_name.includes("Permission"))[0])
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



    async function registerPermission(permissionInfo) {
        setLoading(true);

        const data = permission

        try {
            const request = await api.post('api/permission/register', { data });
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
                                <h3>{sucess ? sucess : "Nova permissão - Preencha todos os campos"}</h3>
                            </div>


                            <div className="registerContainer">
                                <div className="inputContainer">
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="name"
                                                value={permission.name}
                                                onChange={e => {
                                                    setPermission({
                                                        ...permission,
                                                        name: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o nome da permissão</span>
                                        </label>
                                    </div>
                                </div>


                                <button onClick={() =>{
                                    registerPermission();
                                }}>Enviar</button>




                            </div>

                        </>

                    )}



                </div>
            </div>
        </div>
    );
}

export default RegisterPermission;