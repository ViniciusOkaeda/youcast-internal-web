import React, {useEffect, useState} from "react";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Card } from "../../components/cards/card"
import { ChannelsTable, LineupTable, VodsTable } from "../../components/tables/table"
import { Menu } from "../../components/menu/menu";
import "./lineup.css"
import api from "../../services/api";
import { Header } from "../../components/header/header";
import { ValidateToken, GetUserData, Logout } from "../../services/calls";





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
    console.log("os adicionais", additionalParam)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    let dataAvailable = result.availableServices.filter(e => e.service_name.includes("Lineup"))
                    let dataAvailableWithConcat = dataAvailable.concat(id)
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);

                    getChannelsData(dataAvailableWithConcat)
                    getVodsData(dataAvailableWithConcat)
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

    async function getChannelsData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

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

    async function getVodsData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

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

    return(
        <div className="container flex">
            <Menu data={userDataAvailable} />
            {loading ? (
                <div>Loading...</div> // Exibindo um indicador de carregamento
            ) : error ? (
                <div>Error: {error}</div> // Exibindo mensagem de erro, se houver
            ) : (
                <div className="content">
                    <Header data={userData} />
                    <div className="maxWidth">
                    <h3>Pacote: {additionalParam}</h3>
                    <ChannelsTable channelsData={channels} />
                    <VodsTable vodsData={vods} />
                    </div>
                </div>
            )}
        </div>
    )
}


export default DetailedLineup;