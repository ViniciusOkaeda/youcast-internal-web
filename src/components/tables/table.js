import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import './table.css';
import { useNavigate } from 'react-router-dom';
import api from "../../services/api";
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { ExcelExportAtivosTotalMedia, ExcelExportDealers, ExcelExportChannels, ExcelExportVods } from "../excel/excelExport";

const LineupTable = ({ whitelistProducts, data }) => {
    const [searchCompany, setSearchCompany] = useState('');
    const [searchFantasy, setSearchFantasy] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchCnpj, setSearchCnpj] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [searchActive, setSearchActive] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [expandedRowId, setExpandedRowId] = useState(null);
    const navigate = useNavigate();


    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    // Resetar a página atual para 1 quando o número de itens por página mudar
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

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchCompany, searchCategory, searchCnpj, searchCity, searchActive]);

    const handleStatusFilter = (status) => {
        if (status.toLowerCase() === 'ativo') {
            return 1; // Para "Ativo"
        } else if (status.toLowerCase() === 'inativo') {
            return 0; // Para "Inativo"
        }
        return null; // Para outros casos, não aplicar filtro
    };

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = data.filter((item) =>
        item.dealers_company_name?.toLowerCase().includes(searchCompany.toLowerCase()) &&
        item.dealers_fantasy_name?.toLowerCase().includes(searchFantasy.toLowerCase()) &&
        item.dealers_category?.toLowerCase().includes(searchCategory.toLowerCase()) &&
        item.dealers_cnpj?.toLowerCase().includes(searchCnpj.toLowerCase()) &&
        item.dealers_city?.toLowerCase().includes(searchCity.toLowerCase()) &&
        (handleStatusFilter(searchActive) === null ||
            item.dealers_active === handleStatusFilter(searchActive))

    );

    // Calcular os dados a serem exibidos na página atual
    const totalItems = filteredData.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsPerPage === totalItems ? filteredData : filteredData.slice(indexOfFirstItem, indexOfLastItem);
    // Criar botões de paginação
    const totalPages = itemsPerPage === totalItems ? 1 : Math.ceil(totalItems / itemsPerPage);
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
                products_name: item.products_name,
                products_sms_active: item.products_sms_active,
                bouquets_sms_active: item.bouquets_sms_active
            };
        });
    };

    const handleViewMore2 = (id, name) => {
        navigate(`/lineup/${id}`, { state: { additionalParam: name } });
    };

    const renderDetailsTable = (dealerId) => {
        const details = getDetailsForRow(dealerId);
        return (
            <React.Fragment>
                <tr className="trExpanded">
                    <td colSpan="6">
                        <div className="subTableContainer">
                            <table className="subTable">
                                <thead>
                                    <tr>
                                        <th>Pacote</th>
                                        <th>ID Pacote</th>
                                        <th>Status Pacote (SMS)</th>
                                        <th>ID Bouquet</th>
                                        <th>Status Pacote (Bouquet SMS)</th>
                                        <th>ID MW</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {details.map((products, idx) => (
                                        <tr key={idx}>
                                            <td>{products.products_name}</td>
                                            <td>{products.products_dealers_products_id}</td>
                                            <td>{products.products_sms_active === 1 ? "Ativo" : "Inativo"}</td>
                                            <td>{products.products_bouquets_id}</td>
                                            <td>{products.bouquets_sms_active === 1 ? "Ativo" : "Inativo"}</td>
                                            <td>{products.products_mw_id}</td>
                                            <td><button className="btnTableTd" onClick={() => handleViewMore2(products.products_mw_id, products.products_name)}>Ver Conteúdos</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </td>
                </tr>

            </React.Fragment>
        )
    };


    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Detalhes Clientes</h2>
                </div>
                <div className="tableExport" ref={dropdownRef}>
                    <button className="exportButton" onClick={toggleDropdown}>
                        <MoreVertRoundedIcon />
                    </button>
                    {isOpen && (

                        <div className="dropdown-table">
                            <ul>
                                <li>
                                    <ExcelExportDealers
                                        data={currentItems}
                                        whitelistProducts={whitelistProducts}

                                    />
                                </li>
                            </ul>

                        </div>
                    )}
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>
                                Razão Social
                            </th>
                            <th>Nome Fantasia</th>
                            <th>Categoria</th>
                            <th>CNPJ</th>
                            <th>Cidade/Estado</th>
                            <th>Status Integração</th>
                            <th>Pacotes ativos</th>
                            <th>Ações</th>
                        </tr>
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar empresa..."
                                        value={searchCompany}
                                        onChange={(e) => setSearchCompany(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar nome fantasia..."
                                        value={searchFantasy}
                                        onChange={(e) => setSearchFantasy(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar categoria..."
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar cnpj..."
                                        value={searchCnpj}
                                        onChange={(e) => setSearchCnpj(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar cidade..."
                                        value={searchCity}
                                        onChange={(e) => setSearchCity(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <select
                                        id="statusSelect"
                                        value={searchActive}
                                        onChange={(e) => setSearchActive(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                    </select>
                                </div>
                            </th>
                            <th>
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((empresa, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{empresa.dealers_company_name}</td>
                                    <td>{empresa.dealers_fantasy_name}</td>
                                    <td>{empresa.dealers_category}</td>
                                    <td>{empresa.dealers_cnpj}</td>
                                    <td>{empresa.dealers_city + "/" + empresa.dealers_state}</td>
                                    <td>{empresa.dealers_active === 1 ? "Ativo" : "Inativo"}</td>
                                    <td>
                                        {whitelistProducts.filter(whitelist => whitelist.products_dealers_dealers_id === empresa.dealers_id).map(e => e).length}
                                    </td>
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

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20, totalItems].map(number => (
                            <option key={number} value={number}>{number === totalItems ? 'Todos' : number}</option>
                        ))}
                    </select>
                </label>
            </div>


        </div>
    );
}

const ChannelsTable = ({ channelsData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchId, setSearchId] = useState('');
    const [searchChannelName, setSearchChannelName] = useState('');
    const [searchChannelStatus, setSearchChannelStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

    const handleStatusFilter = (status) => {
        if (status.toLowerCase() === 'ativo') {
            return 1; // Para "Ativo"
        } else if (status.toLowerCase() === 'inativo') {
            return 0; // Para "Inativo"
        }
        return null; // Para outros casos, não aplicar filtro
    };

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = channelsData.filter((item) =>
        item.channels_id?.toString().toLowerCase().includes(searchId.toLowerCase()) &&
        item.channels_name?.toLowerCase().includes(searchChannelName.toLowerCase()) &&
        (handleStatusFilter(searchChannelStatus) === null ||
            item.channels_active === handleStatusFilter(searchChannelStatus))
    );

    // Calcular os dados a serem exibidos na página atual
    const totalItems = filteredData.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsPerPage === totalItems ? filteredData : filteredData.slice(indexOfFirstItem, indexOfLastItem);
    // Criar botões de paginação
    const totalPages = itemsPerPage === totalItems ? 1 : Math.ceil(totalItems / itemsPerPage);
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




    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Canais Ativos</h2>
                </div>
                <div className="tableExport" ref={dropdownRef}>
                    <button className="exportButton" onClick={toggleDropdown}>
                        <MoreVertRoundedIcon />
                    </button>
                    {isOpen && (

                        <div className="dropdown-table">
                            <ul>
                                <li>
                                    <ExcelExportChannels
                                        data={currentItems}
                                    />
                                </li>
                            </ul>

                        </div>
                    )}
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>Canal</th>
                            <th>Status Canal</th>
                            <th>Pacote</th>
                            <th>Status Pacote (MW)</th>
                            <th>ID Pacote</th>

                        </tr>
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar canal..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar canal..."
                                        value={searchChannelName}
                                        onChange={(e) => setSearchChannelName(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <select
                                        id="statusSelect"
                                        value={searchChannelStatus}
                                        onChange={(e) => setSearchChannelStatus(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="ativo">Ativo</option>
                                        <option value="inativo">Inativo</option>
                                    </select>
                                </div>
                            </th>
                            <th>
                            </th>
                            <th>

                            </th>
                            <th>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((channels, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{channels.channels_id}</td>
                                    <td>{channels.channels_name}</td>
                                    <td>{channels.channels_active === 1 ? "Ativo" : "Inativo"}</td>
                                    <td>{channels.packages_name}</td>
                                    <td>{channels.packages_active === 1 ? "Ativo" : "Inativo"}</td>
                                    <td>{channels.packages_id}</td>
                                </tr>
                            </React.Fragment>

                        ))
                            :
                            <tr>
                                <td><p>Nenhum Canal encontrado.</p></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20, totalItems].map(number => (
                            <option key={number} value={number}>{number === totalItems ? 'Todos' : number}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
const VodsTable = ({ vodsData }) => {
    const [searchId, setSearchId] = useState('');
    const [searchVodName, setSearchVodName] = useState('');
    const [searchVodGroup, setSearchVodGroup] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
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

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchId, searchVodName, searchVodGroup]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = vodsData.filter((item) =>
        item.vod_id?.toString().toLowerCase().includes(searchId.toLowerCase()) &&
        item.vods_name?.toLowerCase().includes(searchVodName.toLowerCase()) &&
        item.group_vod_name?.toLowerCase().includes(searchVodGroup.toLowerCase()) || false
    );



    const totalItems = filteredData.length;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = itemsPerPage === totalItems ? filteredData : filteredData.slice(indexOfFirstItem, indexOfLastItem);
    // Criar botões de paginação
    const totalPages = itemsPerPage === totalItems ? 1 : Math.ceil(totalItems / itemsPerPage);
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




    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>VODs Ativos</h2>
                </div>
                <div className="tableExport" ref={dropdownRef}>
                    <button className="exportButton" onClick={toggleDropdown}>
                        <MoreVertRoundedIcon />
                    </button>
                    {isOpen && (

                        <div className="dropdown-table">
                            <ul>
                                <li>
                                    <ExcelExportVods
                                        data={currentItems}
                                    />
                                </li>
                            </ul>

                        </div>
                    )}
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>VOD</th>
                            <th>Grupo</th>
                            <th>ID Pacote</th>

                        </tr>
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Id..."
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar VOD..."
                                        value={searchVodName}
                                        onChange={(e) => setSearchVodName(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar VOD..."
                                        value={searchVodGroup}
                                        onChange={(e) => setSearchVodGroup(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.length > 0 ? currentItems.map((vods, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{vods.vod_id}</td>
                                    <td>{vods.vods_name}</td>
                                    <td>{vods.group_vod_name}</td>
                                    <td>{vods.packages_vods_id}</td>
                                </tr>
                            </React.Fragment>

                        ))
                            :
                            <tr>
                                <td><p>Nenhum VOD encontrado.</p></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20, totalItems].map(number => (
                            <option key={number} value={number}>{number === totalItems ? 'Todos' : number}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}

const UsersTable = ({ usersData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = usersData.filter((item) =>
        item.username?.toLowerCase().includes(searchTerm.toLowerCase()) || false
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




    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Users Ativos</h2>
                </div>
                <div className="tableExport">
                    <button className="exportButton">
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Lastname</th>
                            <th>Email</th>
                            <th>Permissão</th>
                            <th>Último Acesso</th>
                            <th>Status</th>
                            <th>Ações</th>

                        </tr>
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar username..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((users, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{users.user_id}</td>
                                    <td>{users.username}</td>
                                    <td>{users.name}</td>
                                    <td>{users.lastname}</td>
                                    <td>{users.email}</td>
                                    <td>{users.type_user}</td>
                                    <td>{users.last_acess}</td>
                                    <td>{users.active === 1 ? "Ativo" : "Inativo"}</td>
                                    <td><button className="btnTableTd"><EditRoundedIcon /></button></td>
                                </tr>
                            </React.Fragment>

                        ))}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}

const PermissionsTable = ({ permissionsData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = permissionsData.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
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




    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Permissões Ativas</h2>
                </div>
                <div className="tableExport">
                    <button className="exportButton">
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </div>


            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>Permissão</th>
                            <th>Ações</th>

                        </tr>

                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar permissão..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar permissão..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />

                                </div>
                            </th>
                            <th>

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((permission, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBody">
                                    <td>{permission.type_user_id}</td>
                                    <td>{permission.name}</td>
                                    <td><button className="btnTableTd"><EditRoundedIcon /></button></td>
                                </tr>
                            </React.Fragment>

                        ))}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
}
const ServicesTable = ({ servicesData }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    console.log("usersData", servicesData)
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

    // Filtrar os dados com base no termo de pesquisa
    const filteredData = servicesData.filter((item) =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false
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




    return (
        <div className="tableContainer">
            <div className="tableHeader">
                <div className="tableTitle">
                    <h2>Serviços Ativos</h2>
                </div>
                <div className="tableExport">
                    <button className="exportButton">
                        <MoreVertRoundedIcon />
                    </button>
                </div>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            <div className="tableWrapper">
                <table>
                    <thead>
                        <tr className="trHeader">
                            <th>ID</th>
                            <th>Serviço</th>
                            <th>Descrição</th>
                            <th>MW Url</th>
                            <th>MW Login</th>
                            <th>MW Secret</th>
                            <th>MW Aux</th>
                            <th>SMS Url</th>
                            <th>SMS Login</th>
                            <th>SMS Secret</th>
                            <th>SMS Aux</th>
                            <th>Ações</th>

                        </tr>
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar serviço..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>

                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((services, idx) => (
                            <React.Fragment key={idx}>
                                <tr className="trBodyService">
                                    <td>{services.type_service_id}</td>
                                    <td>{services.name}</td>
                                    <td>{services.description}</td>
                                    <td>{services.middleware_mw}</td>
                                    <td>{services.username_mw}</td>
                                    <td>{services.secret_mw}</td>
                                    <td>{services.aux_mw}</td>
                                    <td>{services.middleware_sms}</td>
                                    <td>{services.username_sms}</td>
                                    <td>{services.secret_sms}</td>
                                    <td>{services.aux_sms}</td>
                                    <td><button className="btnTableTd"><EditRoundedIcon /></button></td>
                                </tr>
                            </React.Fragment>

                        ))}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                {renderPageNumbers()}
            </div>

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
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

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

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
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Relatório..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Relatório..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Relatório..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>

                            </th>
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

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
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

    useEffect(() => {
        setCurrentPage(1); // Resetar a página para 1 quando searchTerm mudar
    }, [searchTerm]);

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
                        <tr className="trHeader">
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Provedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Provedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Provedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Provedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>
                                <div className="searchContainerToTable">
                                    <input
                                        type="text"
                                        placeholder="Pesquisar Provedor..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </th>
                            <th>

                            </th>
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

            <div className="searchContainer">
                <label>
                    Itens por página:
                    <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                        {[5, 10, 15, 20].map(number => (
                            <option key={number} value={number}>{number}</option>
                        ))}
                    </select>
                </label>
            </div>
        </div>
    );
};


export { LineupTable, ReportsTable, ReportsTableTotalMedia, ServicesTable, PermissionsTable, ChannelsTable, VodsTable, UsersTable };