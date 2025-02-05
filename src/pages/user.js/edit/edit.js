import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Menu } from "../../../components/menu/menu";
import { Header } from "../../../components/header/header";
import { useParams, useLocation } from "react-router-dom";

import { ValidateToken, Logout, GetUserDataById, GetPermissionsData } from "../../../services/calls";

function EditUser() {
    const { id } = useParams();
    const location = useLocation();

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
    const [user, setUser] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        name: "",
        lastname: "",
        email: "",
        active: 1,
        type_user_id: 0
    })

    const [userData, setUserData] = useState(null);
    const [userDataById, setUserDataById] = useState([]);
    const [permissionData, setPermissionData] = useState([]);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserDataById(parseInt(id));
                if (result) {
                    setUserData(location.state.userData)
                    setUserDataById(result.userInfo[0]);
                    setUserDataAvailable(location.state.userData.availableServices || []);
                    setUserPermissions(location.state.userData.availableServices.filter(e => e.service_name.includes("User"))[0])
                    GetPermissionsData(location.state.userData.availableServices.filter(e => e.service_name.includes("Permission"))[0], setLoading, setPermissionData, setError)
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

    async function editUser(permissionInfo) {
        setLoading(true);
        const data = user

        try {
            const request = await api.post('api/user/edit', { data });
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
                                <h3>{sucess ? sucess : "Editar Usuário"}</h3>
                            </div>


                            <div className="registerContainer">
                                <div className="inputContainer">
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="name"
                                                value={userDataById.name}
                                                onChange={e => {
                                                    setUser({
                                                        ...user,
                                                        name: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite seu nome</span>
                                        </label>
                                    </div>
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="lastname"
                                                value={userDataById.lastname}
                                                onChange={e => {
                                                    setUser({
                                                        ...user,
                                                        lastname: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite seu sobrenome</span>
                                        </label>
                                    </div>
                                </div>


                                <div className="inputContainer">
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="text"
                                                name="username"
                                                value={userDataById.username}
                                                onChange={e => {
                                                    setUser({
                                                        ...user,
                                                        username: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite seu usuário</span>
                                        </label>
                                    </div>


                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="password"
                                                name="password"
                                                value={user.password}
                                                onChange={e => {
                                                    setUser({
                                                        ...user,
                                                        password: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Digite sua senha</span>
                                        </label>
                                    </div>
                                    <div className="style-input-group">
                                        <label className="style-input-filled">
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={user.confirmPassword}
                                                onChange={e => {
                                                    setUser({
                                                        ...user,
                                                        confirmPassword: e.target.value
                                                    });
                                                }}
                                                required
                                            />
                                            <span className="style-input-label">Confirme sua senha</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="style-input-group">
                                    <label className="style-input-filled">
                                        <input
                                            type="text"
                                            name="email"
                                            value={userDataById.email}
                                            onChange={e => {
                                                setUser({
                                                    ...user,
                                                    email: e.target.value
                                                });
                                            }}
                                            required
                                        />
                                        <span className="style-input-label">Digite seu email</span>
                                    </label>
                                </div>

                                <div className="inputContainer">
                                    <div className="style-input-group">

                                        
                                        <label htmlFor="permission" className="style-input-filled">
                                            <select name="permission" 
                                            value={userDataById.type_user_id}
                                            onChange={e => {
                                                setUser({
                                                    ...user,
                                                    type_user_id: e.target.value
                                                });
                                            }}>
                                                <option value="">Selecione uma permissão</option>
                                                {permissionData.map((perm, idx) => {

                                                    return(
                                                        <option key={idx} value={perm.type_user_id}>
                                                            {perm.name}
                                                        </option>
                                                    )
                                                })}
                                            </select>


                                        <span className="style-input-label input-margin-right">Selecione uma permissão: </span>
                                        </label>

                                    </div>

                                    <div className="style-input-group">

                                        <label htmlFor="permission" className="style-input-filled">
                                            <select name="active" 
                                            value={userDataById.active}
                                            onChange={e => {
                                                setUser({
                                                    ...user,
                                                    active: e.target.value
                                                })}}>
                                                <option value="">Selecione uma opção</option>

                                                {options.map((item, idx) => {
                                                    return(
                                                        <option key={idx} value={item.value}>
                                                            {item.type}
                                                        </option>
                                                    )
                                                })}

                                            </select>

                                        <span className="style-input-label input-margin-right">Definir usuário como: </span>
                                        </label>

                                    </div>
                                </div>


                                <button onClick={() =>{
                                    editUser();
                                }}>Enviar</button>




                            </div>

                        </>

                    )}



                </div>
            </div>
        </div>
    );
}

export default EditUser;