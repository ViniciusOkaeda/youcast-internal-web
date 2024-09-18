import React, { useEffect, useState } from "react";
import { Card } from "../../components/cards/card";
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/menu/menu";
import "./service.css";
import { Header } from "../../components/header/header";
import { ValidateToken, GetUserData, Logout } from "../../services/calls";

function Service() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Inicialmente, está carregando
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
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
            {loading ? (
                <div>Loading...</div> // Exibindo um indicador de carregamento
            ) : error ? (
                <div>Error: {error}</div> // Exibindo mensagem de erro, se houver
            ) : (
                <div className="content">
                    <Header data={userData} />
                    <div className="maxWidth">
                        <Card />

                    </div>
                </div>
            )}
        </div>
    );
}

export default Service;