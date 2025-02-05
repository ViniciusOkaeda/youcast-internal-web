import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ChannelsTable, LineupTable, VodsTable } from "../../components/tables/table"
import { Menu } from "../../components/menu/menu";
import "./lineup.css"
import api from "../../services/api";
import { Header } from "../../components/header/header";
import { ValidateToken, GetUserData, Logout, GetChannelsData, GetVodsData } from "../../services/calls";





function DetailedLineup() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);

    const [channels, setChannels] = useState([]);
    const [vods, setVods] = useState([]);

    const { id } = useParams(); // Pega o ID da URL
    const location = useLocation();
    const { additionalParam } = location.state || {}; // Captura parâmetros adicionais se existirem

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    let dataAvailable = result.availableServices.filter(e => e.service_name.includes("Lineup"))
                    let dataAvailableWithConcat = dataAvailable.concat(id)
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    GetChannelsData(dataAvailableWithConcat, setLoading, setChannels, setError)
                    GetVodsData(dataAvailableWithConcat, setLoading, setVods, setError)
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
                            <div className="initialContainer">
                                <h3>Pacote: {additionalParam}</h3>

                            </div>
                            <ChannelsTable channelsData={channels} loading={loading} error={error} />
                            <VodsTable vodsData={vods} loading={loading} error={error} />

                        </>

                    )}

                </div>
            </div>
        </div>
    )
}


export default DetailedLineup;