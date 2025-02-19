import React, { useEffect, useState } from "react";
import { HistoryTypeTable, ImportExcelFile } from "../../components/tables/table"
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/menu/menu";
import "./history.css"
import { Header } from "../../components/header/header";
import * as XLSX from "xlsx";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import { ValidateToken, GetUserData, Logout, GetDealerData, GetWhitelistProductsData, GetHistoryTypes } from "../../services/calls";





function History() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState(null);
    const [userDataAvailable, setUserDataAvailable] = useState([]);
    const [userPermissions, setUserPermissions] = useState([]);
    const [historyTypes, setHistoryTypes] = useState([]);
    const [dealers, setDealers] = useState([]);
    const [products, setProducts] = useState([]);
    const [items, setItems] = useState([]);

    const readExcel = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);

            fileReader.onload = (e) => {
                const bufferArray = e.target.result;

                const wb = XLSX.read(bufferArray, { type: "buffer" });

                const wsname = wb.SheetNames[1];

                const ws = wb.Sheets[wsname];

                const data = XLSX.utils.sheet_to_json(ws);

                resolve(data);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });

        promise.then((d) => {
            setItems(d);
        });
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await GetUserData();
                if (result) {
                    setUserData(result);
                    setUserDataAvailable(result.availableServices || []);
                    setUserPermissions(result.availableServices.filter(e => e.service_name.includes("History"))[0])
                    GetHistoryTypes(setLoading, setHistoryTypes, setError)
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
                            {userPermissions.register_right === 1 ?
                                <div className="registerButtonContainer">
                                    <button className="registerButton" onClick={(() => navigate('/history/register'))}>
                                        <PersonAddRoundedIcon />
                                        <p>Novo histórico</p>
                                    </button>
                                </div>

                            : ""}

                        <HistoryTypeTable data={historyTypes} />
                        </>
                    )}

                </div>
            </div>
        </div>
    )
}


export default History;