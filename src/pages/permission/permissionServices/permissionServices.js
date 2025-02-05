import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../../components/menu/menu";
import "../permission.css";
import api from "../../../services/api";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { Header } from "../../../components/header/header";

import { ValidateToken, GetUserData, Logout } from "../../../services/calls";
import { PermissionsTable } from "../../../components/tables/table";

function PermissionServices() {

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
    const [sucess, setSucess] = useState('')
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([])
    const [servicesData, setServicesData] = useState([])
    const { id } = useParams(); // Pega o ID da URL
    const [permissionService, setPermissionService] = useState({
        type_user_id: parseInt(id),
        type_service_id: null,
        view_right: null,
        edit_right: null,
        register_right: null,
        delete_right: null,
        massive_right: null,
        action_right: null
    })


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserPermissions(result.availableServices.filter(e => e.service_name.includes("Permission"))[0])
                    getServicesData(result.availableServices.filter(e => e.service_name.includes("Service"))[0])
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

    async function getServicesData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

        try {
            const request = await api.post('api/service/getServicesData', { data });
            if (request.data.status === 1) {
                setServicesData(request.data?.serviceData || []);
            } else {
                setError('Failed to load data');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }


    async function registerServicePermission(permissionInfo) {
        setLoading(true);

        const data = permissionService
        console.log("minha data", data)

        try {
            const request = await api.post('api/permission/registerServicePermission', { data });
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
                                <>
                                    <div className="initialContainer">
                                        <h3>{sucess ? sucess : "Adicionar permissões de serviço"}</h3>
                                    </div>


                                    <div className="registerContainer">

                                        <div className="inputContainer">
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="permission" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            type_service_id: parseInt(e.target.value)
                                                        });
                                                    }}>
                                                        <option value="">Selecione um serviço</option>
                                                        {servicesData.map((serv, idx) => {

                                                            return (
                                                                <option key={idx} value={serv.type_service_id}>
                                                                    {serv.name}
                                                                </option>
                                                            )
                                                        })}
                                                    </select>


                                                    <span className="style-input-label input-margin-right">Selecione um serviço: </span>
                                                </label>

                                            </div>
                                        </div>

                                        <div className="inputContainer">

                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            view_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Visualização: </span>
                                                </label>

                                            </div>
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            edit_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Editar: </span>
                                                </label>

                                            </div>
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            register_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Registrar: </span>
                                                </label>

                                            </div>
                                        </div>

                                        <div className="inputContainer">
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            delete_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Deletar: </span>
                                                </label>

                                            </div>
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            action_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Exportar: </span>
                                                </label>

                                            </div>
                                            <div className="style-input-group">


                                                <label htmlFor="permission" className="style-input-filled">
                                                    <select name="active" onChange={e => {
                                                        setPermissionService({
                                                            ...permissionService,
                                                            massive_right: parseInt(e.target.value)
                                                        })
                                                    }}>
                                                        <option value="">Selecione uma opção</option>

                                                        {options.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item.value}>
                                                                    {item.type}
                                                                </option>
                                                            )
                                                        })}

                                                    </select>


                                                    <span className="style-input-label input-margin-right">Permissão de Ações em massa: </span>
                                                </label>

                                            </div>
                                        </div>


                                        <button onClick={() => {
                                            registerServicePermission();
                                        }}>Enviar</button>

                                    </div>
                                </>

                                : ""}
                        </>

                    )}


                </div>
            </div>
        </div>
    );
}

export default PermissionServices;