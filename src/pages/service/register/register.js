import React, { useEffect, useState } from "react";
import { Card } from "../../../components/cards/card";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Menu } from "../../../components/menu/menu";
import "./register.css";
import { Header } from "../../../components/header/header";

import { ValidateToken, GetUserData, Logout } from "../../../services/calls";

function RegisterService() {

    const options = [{
        type: "Ativo",
        value: 1
    },{
        type: "Inativo",
        value: 0
    }]

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [sucess, setSucess] = useState('');
    const [service, setService] = useState({
        name: "",
        description: "",
        middleware_mw: "",
        username_mw: "",
        secret_mw: "",
        aux_mw: null,
        middleware_sms: "",
        username_sms: "",
        secret_sms: "",
        aux_sms: null
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



    async function registerService(permissionInfo) {
        setLoading(true);

        const data = service

        try {
            const request = await api.post('api/service/register', { data });
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
                                <h3>{sucess ? sucess : "Novo serviço - Preencha os campos"}</h3>
                            </div>


                            <div className="registerContainer">
                            <div className="style-input-group">
                                    <label className="style-input-filled">
                                        <input
                                            type="text"
                                            name="name"
                                            value={service.name}
                                            onChange={e => {
                                                setService({
                                                    ...service,
                                                    name: e.target.value
                                                });
                                            }}
                                            required
                                        />
                                        <span className="style-input-label">Digite o nome do serviço</span>
                                    </label>
                                </div>
                            <div className="style-input-group">
                                    <label className="style-input-filled">
                                        <input
                                            type="text"
                                            name="description"
                                            value={service.description}
                                            onChange={e => {
                                                setService({
                                                    ...service,
                                                    description: e.target.value
                                                });
                                            }}
                                            required
                                        />
                                        <span className="style-input-label">Digite a descrição do serviço</span>
                                    </label>
                                </div>

                                <div className="inputContainer">
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="middleware_mw"
                                                value={service.middleware_mw}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        middleware_mw: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite a url mw</span>
                                        </label>
                                    </div>
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="middleware_sms"
                                                value={service.middleware_sms}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        middleware_sms: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite a url sms</span>
                                        </label>
                                    </div>
                                </div>


                                <div className="inputContainer">
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="username_mw"
                                                value={service.username_mw}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        username_mw: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o login mw</span>
                                        </label>
                                    </div>


                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="username_sms"
                                                name="text"
                                                value={service.username_sms}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        username_sms: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o login sms</span>
                                        </label>
                                    </div>

                                </div>



                                <div className="inputContainer">
                                <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="secret_mw"
                                                value={service.secret_mw}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        secret_mw: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o secret mw</span>
                                        </label>
                                    </div>

                                <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="secret_sms"
                                                value={service.secret_sms}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        secret_sms: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o secret sms</span>
                                        </label>
                                    </div>

                                </div>
                                <div className="inputContainer">
                                <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="number"
                                                name="aux_mw"
                                                value={service.aux_mw}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        aux_mw: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o auxiliar mw</span>
                                        </label>
                                    </div>

                                <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="number"
                                                name="aux_sms"
                                                value={service.aux_sms}
                                                onChange={e => {
                                                    setService({
                                                        ...service,
                                                        aux_sms: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite o auxiliar sms</span>
                                        </label>
                                    </div>

                                </div>


                                <button onClick={() =>{
                                    registerService();
                                }}>Enviar</button>




                            </div>

                        </>

                    )}



                </div>
            </div>
        </div>
    );
}

export default RegisterService;