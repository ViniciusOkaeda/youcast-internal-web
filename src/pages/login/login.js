import React, {useState, useEffect} from "react";
import './login.css'
import Logo from '../../assets/Logo_youcast_branco.png'
import sucessBgd from '../../assets/bgd_sucess2.png'
import sucessBgd2 from '../../assets/bgd_qsl.jpg'
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { ValidateToken, Logout } from "../../services/calls";


function Login() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        login: "",
        password: ""
    })

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    useEffect(() => {
        const checkData = async () => {
            try {
              const result = await ValidateToken();
              if(result.status !== 1) {
                if(result.status !== 16) {
                    const clearSession = await Logout();
                    if(clearSession.status === 1){
                        navigate("/");
                    }
                }
              } else if (result.status === 1) {
                navigate("/dashboard");
              }


            } catch (err) {
                console.log(error)
            }
        }; checkData();
    },[])


    async function sendLogin() {

        setLoading(true);
        
        try {
            console.log("até aqui cheguei")
            const request = await api.post('api/auth/login', {user})
            console.log("meu request vem", request)
            if(request.data.status === 1) {
                setLoading(false);
                navigate("/dashboard");
            } else {
                setError(request.data.message);
                setLoading(false);
            }
            //console.log("o request aq", request)

        } catch (error) {
            setError(error);
            setLoading(false);
        }
    }

    return(
        <div className="containerLogin">
            <div className="bgdAndLogo">
                <img src={Logo} className="logo"></img>
            </div>

            <div className="formContainer">


                <div className="formTextInitial">
                        <h2>Entre com sua conta</h2>
                        <h4>preencha os campos abaixo!</h4>

                </div>

                <div className="formContent">

                            <div className="style-input-group">
                                <label className="style-input-filled">
                                <input
                                    type="text"
                                    name="login"
                                    value={user.login}
                                    onChange={e => {
                                    setUser({
                                        ...user,
                                        login: e.target.value
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
                            
                            {error ? <p className="error">{error}</p> : ""}

                            <button 
                            disabled={loading === true}
                            onClick={sendLogin}>
                            {loading === true ? "Aguarde..." : "Enviar"}
                            </button>




                </div>

            </div>
            
        </div>
    )

}

export default Login