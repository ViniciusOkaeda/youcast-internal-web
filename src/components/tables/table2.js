// src/AdvancedTable.js
import React, { useState } from 'react';

// Dados de exemplo


const AdvancedTable = async (dealers) => {
    const [filteredData, setFilteredData] = useState(dealers.data);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState('dealers_company_name');
    const [sortDirection, setSortDirection] = useState('asc');

    // Filtrar os dados com base no termo de pesquisa
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = dealers.data.filter(
            (item) =>
                item.dealers_company_name.toLowerCase().includes(term) ||
                item.dealers_city.toString().includes(term) ||
                item.dealers_state.toString().includes(term)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Resetar a página para 1 ao buscar
    };

    // Ordenar os dados
    const handleSort = (column) => {
        const direction = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
        setSortColumn(column);
        setSortDirection(direction);

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[column] < b[column]) return direction === 'asc' ? -1 : 1;
            if (a[column] > b[column]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setFilteredData(sortedData);
    };

    // Calcular os dados a serem exibidos na página atual
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Criar botões de paginação
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <>
            <div className="tableContainer">
                <div className="tableHeader">
                    <div className="tableTitle">
                        <h2>Detalhes Clientes</h2>
                    </div>

                    <div className="tableExport">
                        <button className="exportButton">
                        </button>
                    </div>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Pesquisar..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <label>
                        Itens por página:
                        <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                            {[5, 10, 15, 20].map(number => (
                                <option key={number} value={number}>{number}</option>
                            ))}
                        </select>
                    </label>

                    <table>
                        <thead>
                            <tr className="trHeader">
                                <th onClick={() => handleSort('id')}>
                                    ID {sortColumn === 'id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('name')}>
                                    Nome {sortColumn === 'name' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                                <th onClick={() => handleSort('age')}>
                                    Idade {sortColumn === 'age' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {currentItems.map((empresa, idx) => {
                            console.log("meu curret", currentItems)
                    return(
                        <>
                            <tr key={idx} className="trBody">
                                <td>{empresa.dealers_company_name}</td>
                                <td>{
                                empresa.parent_dealers_id === 5 ? "Vendor"
                                : empresa.parent_dealers_id === 15 ? "Brand Yplay" : ""
                                
                                }
                                </td>
                                <td>{empresa.dealers_cnpj}</td>
                                <td>{empresa.dealers_city + "/" + empresa.dealers_state}</td>
                                <td>0</td>
                                <td>{empresa.dealers_active === 1 ? "Ativo" : "Inativo"}</td>
                                <td><button>det</button></td>
                            </tr>
                        </>
                    )
                })}
                        </tbody>
                    </table>
                    <div className='flexNavigation'>
                        {pageNumbers.map((number) => (
                            <button key={number} onClick={() => setCurrentPage(number)}>
                                {number}
                            </button>
                        ))}
                    </div>
                </div>
            </div>


        </>


    );
};


export const TableAdvanced = () => {

    return(
        <></>
    )
}

