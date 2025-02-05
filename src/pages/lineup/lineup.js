import React, { useEffect, useState } from "react";
import { LineupTable } from "../../components/tables/table"
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/menu/menu";
import "./lineup.css"
import { Header } from "../../components/header/header";
import { ValidateToken, GetUserData, Logout, GetDealerData, GetWhitelistProductsData } from "../../services/calls";





function Lineup() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    let dataAvailable = result.availableServices.filter(e => e.service_name.includes("Lineup"))
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    GetDealerData(dataAvailable, setLoading, setDealers, setError)
                    GetWhitelistProductsData(dataAvailable, setLoading, setProducts, setError)
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
                            <LineupTable whitelistProducts={products} data={dealers} />

                        </>
                    )}

                </div>
            </div>
        </div>
    )
}


export default Lineup;