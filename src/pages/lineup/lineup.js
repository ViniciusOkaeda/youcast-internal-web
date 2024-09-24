import React, {useEffect, useState} from "react";
import { Card } from "../../components/cards/card"
import { LineupTable } from "../../components/tables/table"
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/menu/menu";
import "./lineup.css"
import api from "../../services/api";
import { Header } from "../../components/header/header";
import { ValidateToken, GetUserData, Logout } from "../../services/calls";





function Lineup() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [products, setProducts] = useState([]);
    const [channels, setChannels] = useState([]);
    const [vods, setVods] = useState([]);



    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    let dataAvailable = result.availableServices.filter(e => e.service_name.includes("Lineup"))
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    getDealerData(dataAvailable)
                    getWhitelistProductsData(dataAvailable)
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

    async function getDealerData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

        try {
            const request = await api.post('api/dealer/getDealersData', { data });
            if (request.data.status === 1) {
                setDealers(request.data?.data[0].dealersInfo.rows || []);
            } else {
                setError('Failed to load data');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    async function getWhitelistProductsData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo

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
                        <Card />
                        <LineupTable whitelistProducts={products} data={dealers} channelsData={channels} vodsData={vods} />

                    </div>
                </div>
            )}
        </div>
    )
}


export default Lineup;