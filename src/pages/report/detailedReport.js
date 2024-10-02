import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { ValidateToken, GetUserData, Logout } from "../../services/calls";
import React, { useEffect, useState } from "react";
import { Card } from "../../components/cards/card";
import { Menu } from "../../components/menu/menu";
import api from "../../services/api";
import "./report.css";
import { Header } from "../../components/header/header";
import { ReportsTableTotalMedia } from "../../components/tables/table";

function DetailedReport() {
    const { id } = useParams(); // Pega o ID da URL
    const location = useLocation();
    const { additionalParam } = location.state || {}; // Captura parâmetros adicionais se existirem
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userFilteredDataAvailable, setUserFilteredDataAvailable] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [products, setProducts] = useState([]);





    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserFilteredDataAvailable(result.availableServices.filter(e => e.type_service_id.toString() === id && e.service_name.includes("Report")) || []);
                    getDealerData(result.availableServices.filter(e => e.type_service_id.toString() === id && e.service_name.includes("Report")));
                    getProductData(result.availableServices.filter(e => e.type_service_id.toString() === id && e.service_name.includes("Report")));
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

        const data = permissionInfo;
        //console.log("a data", data)

        try {
            const request = await api.post('api/dealer/getDealersData', { data });
            if (request.data.status === 1) {
                //console.log("o request", request.data?.dealerData || [])
                setDealers(request.data?.dealerData || []);
            } else {
                setError('Failed to load data');
            }
        } catch (error) {
            console.log("erro", error)
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }
    async function getProductData(permissionInfo) {
        setLoading(true);

        const data = permissionInfo;
        //console.log("a data", data)

        try {
            const request = await api.post('api/product/getProductsData', { data });
            if (request.data.status === 1) {
                //console.log("o request product", request.data.productData || [])
                setProducts(request.data?.productData || []);
            } else {
                setError('Failed to load data');
            }
        } catch (error) {
            console.log("erro", error)
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
                            {userFilteredDataAvailable.length > 0
                                ?
                                <div>
                                    <ReportsTableTotalMedia products={products} data={dealers} />

                                </div>
                                :
                                <div className='detailNotFound'>
                                    <p>Relatório não encontrado. Para verificar quais relatórios você tem acesso, <a href="/report">clique aqui.</a></p>
                                </div>
                            }
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}

export default DetailedReport;