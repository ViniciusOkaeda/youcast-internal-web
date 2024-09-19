import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import './table.css';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import { ExcelExportAtivosTotalMedia } from "../excel/excelExport";

const LineupTable = ({ whitelistProducts, data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRowId, setExpandedRowId] = useState(null);

    //console.log("minha whitelist", whitelistProducts)
    //console.log("minha data", data)

    // Resetar a página atual para 1 quando o número de itens por página mudar
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = data.filter((item) =>
        item.dealers_company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    );

    // Calcular os dados a serem exibidos na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Criar botões de paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Função para renderizar a lista de páginas com ...
    const renderPageNumbers = () => {
        const maxPageNumbers = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

        let pages = [];
        if (startPage > 1) pages.push(1, '...');
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) pages.push('...', totalPages);

        return pages.map((number, index) => (
            number === '...' ? (
                <span key={index} className="pageEllipsis">...</span>
            ) : (
                <button
                    key={index}
                    onClick={() => setCurrentPage(number)}
                    className={currentPage === number ? 'activeBtn' : ''}
                >
                    {number}
                </button>
            )
        ));
    };

    const changeDealerIdToName = (dealer_id) => {

        switch(dealer_id){
            case 1:
                return "";
            case 5:
                return "Vendor";
            case 15:
                return "Brand Yplay";
            case 23:
                return "Brand WSP";
            case 25:
                return "Brand Yplay - Cariap";
            case 41:
                return "Brand Yplay - IDCORP";
            case 134:
                return "Brand Olla";
            case 148:
                return "Brand Yplay - Alloha";
            case 153:
                return "Brand Yplay CO";
            case 166:
                return "Brand ClickIP";
            case 177:
                return "Brand Yplay CO - Fibercomm";
            case 178:
                return "Brand SouPlay";
            case 181:
                return "Brand Nortetel";
            case 184:
                return "Brand Yplay - Alloha";
            case 186:
                return "Brand Yplay - Alloha";
            case 190:
                return "Brand Yplay - Alloha";
            case 219:
                return "Brand Yplay - InterfaceNet";
            case 263:
                return "Brand Newbrasil";
            case 278:
                return "Brand Uni";
            case 299:
                return "Brand Yplay - Kase";
            default:
                return "N/A";
        }

    }

    const handleViewMore = useCallback((id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    }, [expandedRowId]);

    const getDetailsForRow = (dealerId) => {
        //console.log("aqui o white", whitelistProducts)

        return whitelistProducts.filter(dados => dealerId === dados.products_dealers_dealers_id
        ).map(item => {
            return {
                bouquets_name: item.bouquets_name,
                products_bouquets_id: item.products_bouquets_id,
                products_dealers_dealers_id: item.products_dealers_dealers_id,
                products_dealers_products_id: item.products_dealers_products_id,
                products_mw_id: item.products_mw_id,
                products_name: item.products_name
            };
        });
    };

    const renderDetailsTable = (dealerId) => {
        const details = getDetailsForRow(dealerId);

        return details.map((detail, index) => (
            <tr key={index} className="trExpanded">
                <td colSpan="6">
                    <div className="subTableContainer">
                        <table className="subTable">
                            <thead>
                                <tr>
                                    <th>Login</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*
                                
                                {detail.customer.map((customer, idx) => (
                                    <tr key={idx}>
                                        <td>{customer.login}</td>
                                        <td>{customer.haveTotalMedia === 1 ? "Pacote Ativo" : ""}</td>
                                    </tr>
                                ))}
                                
                                */}
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Detalhes Clientes</h2>
                </div>
                <div className="tableExport">
                    <button className="exportButton">
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </div>

            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="Pesquisar empresa..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>Empresa</th>
                            <th>Categoria</th>
                            <th>CNPJ</th>
                            <th>Cidade/Estado</th>
                            <th>Pacotes ativos</th>
                            <th>Contrato</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((empresa, idx) => (
                            <React.Fragment key={idx}>
                                <tr  className="trBody">
                                    <td>{empresa.dealers_company_name}</td>
                                    <td>{changeDealerIdToName(empresa.parent_dealers_id)}</td>
                                    <td>{empresa.dealers_cnpj}</td>
                                    <td>{empresa.dealers_city + "/" + empresa.dealers_state}</td>
                                    <td>
                                        {whitelistProducts.filter(whitelist => whitelist.products_dealers_dealers_id === empresa.dealers_id).map(e => e).length}
                                    </td>
                                    <td>{empresa.dealers_active === 1 ? "Ativo" : "Inativo"}</td>
                                    <td>
                                        <button className="btnTableTd" onClick={() => handleViewMore(empresa.dealers_id)}>
                                            {expandedRowId === empresa.dealers_id ? 'Ver Menos' : 'Ver Mais'} <ArrowCircleRightRoundedIcon />
                                        </button>                                
                                    </td>
                                </tr>
                                {expandedRowId === empresa.dealers_id && renderDetailsTable(empresa.dealers_id)}
                            </React.Fragment>

                        ))}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    );
}

const ReportsTable = ({ data }) => {

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();


    // Resetar a página atual para 1 quando o número de itens por página mudar
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = data.filter((item) =>
        item.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
    );

    // Calcular os dados a serem exibidos na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Criar botões de paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Função para renderizar a lista de páginas com ...
    const renderPageNumbers = () => {
        const maxPageNumbers = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

        let pages = [];
        if (startPage > 1) pages.push(1, '...');
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) pages.push('...', totalPages);

        return pages.map((number, index) => (
            number === '...' ? (
                <span key={index} className="pageEllipsis">...</span>
            ) : (
                <button
                    key={index}
                    onClick={() => setCurrentPage(number)}
                    className={currentPage === number ? 'activeBtn' : ''}
                >
                    {number}
                </button>
            )
        ));
    };

    const handleViewMore = (id) => {
        const params = currentItems.filter(e => e.type_service_id === id)
        navigate(`/report/${id}`, { state: { additionalParam: params } });
    };

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Relatórios Disponíveis</h2>
                </div>
                <div className="tableExport">
                    <button className="exportButton">
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </div>

            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="Pesquisar Relatório..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>Relatório</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentItems.map((e, idx) => {

                                return (
                                    <tr key={idx} className="trBody">
                                        <td>{e.type_service_id}</td>
                                        <td>{e.service_name}</td>
                                        <td>Visualização de Relatório </td>
                                        <td><button className="btnTableTd"
                                            onClick={() => handleViewMore(e.type_service_id)}
                                        >Ver Relatório <ArrowCircleRightRoundedIcon /></button></td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    )
}

const ReportsTableTotalMedia = ({ products, data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRowId, setExpandedRowId] = useState(null);


    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);

        document.addEventListener('mousedown', handleClickOutside);

        // Remove o ouvinte de eventos quando o componente é desmontado
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);

        };
    }, [itemsPerPage]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };


    //O report totalmedia é uma particularidade onde foi necessário criar 2 filteredData. Em casos normais será somente 1
    const filteredData = useMemo(() =>
        data.filter(item => products.map(e => e.dealer).includes(item.dealers_name)) || [],
        [data, products]);

    const filteredData2 = useMemo(() =>
        filteredData.filter(item =>
            item.dealers_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
        ),
        [filteredData, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = useMemo(() => filteredData2.slice(indexOfFirstItem, indexOfLastItem),
        [filteredData2, indexOfFirstItem, indexOfLastItem]);

    const totalPages = useMemo(() => Math.ceil(filteredData2.length / itemsPerPage), [filteredData2, itemsPerPage]);

    const renderPageNumbers = useCallback(() => {
        const maxPageNumbers = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
        const endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

        let pages = [];
        if (startPage > 1) pages.push(1, '...');
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        if (endPage < totalPages) pages.push('...', totalPages);

        return pages.map((number, index) =>
            number === '...' ? (
                <span key={index} className="pageEllipsis">...</span>
            ) : (
                <button
                    key={index}
                    onClick={() => setCurrentPage(number)}
                    className={currentPage === number ? 'activeBtn' : ''}
                >
                    {number}
                </button>
            )
        );
    }, [currentPage, totalPages]);

    const handleViewMore = useCallback((id) => {
        setExpandedRowId(expandedRowId === id ? null : id);
    }, [expandedRowId]);

    const getDetailsForRow = (dealerName) => {
        return products.filter(dados => dealerName.includes(dados.dealer)).map(item => {
            return {
                dealer: item.dealer,
                customer: item.customers.map(customer => ({
                    login: customer.login,
                    haveTotalMedia: customer.packages.filter(pkg => pkg.haveTotalMedia === 1).length
                }))
            };
        });
    };

    const renderDetailsTable = (dealerName) => {
        const details = getDetailsForRow(dealerName);
        return details.map((detail, index) => (
            <tr key={index} className="trExpanded">
                <td colSpan="6">
                    <div className="subTableContainer">
                        <table className="subTable">
                            <thead>
                                <tr>
                                    <th>Login</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detail.customer.map((customer, idx) => (
                                    <tr key={idx}>
                                        <td>{customer.login}</td>
                                        <td>{customer.haveTotalMedia === 1 ? "Pacote Ativo" : ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Total Media</h2>
                </div>
                <div className="tableExport" ref={dropdownRef}>
                    <button className="exportButton" onClick={toggleDropdown}>
                        <MoreVertRoundedIcon />
                    </button>
                    {isOpen && (

                        <div className="dropdown-table">
                            <ul>
                                <li>
                                    <ExcelExportAtivosTotalMedia
                                        data={data.filter(item => products.map(e => e.dealer).includes(item.dealers_name))}
                                        month={0}
                                        assinant={0}
                                        fatured={0}
                                        usersDealerInfo={products}

                                    />
                                </li>
                            </ul>

                        </div>
                    )}
                </div>
            </div>

            <div className="searchContainer">
                <input
                    type="text"
                    placeholder="Pesquisar Provedor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>Provedor</th>
                            <th>Razão Social</th>
                            <th>CNPJ</th>
                            <th>Cidade</th>
                            <th>Assinantes</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((e, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{e.dealers_company_name}</td>
                                    <td>{e.dealers_fantasy_name}</td>
                                    <td>{e.dealers_cnpj}</td>
                                    <td>{e.dealers_city + "/" + e.dealers_state}</td>
                                    <td>
                                        {getDetailsForRow(e.dealers_name).reduce((acc, curr) =>
                                            acc + curr.customer.length, 0)}
                                    </td>
                                    <td>
                                        <button className="btnTableTd" onClick={() => handleViewMore(e.dealers_name)}>
                                            {expandedRowId === e.dealers_name ? 'Ver Menos' : 'Ver Mais'} <ArrowCircleRightRoundedIcon />
                                        </button>
                                    </td>
                                </tr>
                                {expandedRowId === e.dealers_name && renderDetailsTable(e.dealers_name)}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {renderPageNumbers()}
            </div>
        </div>
    );
};

export default ReportsTableTotalMedia;

export { LineupTable, ReportsTable, ReportsTableTotalMedia };