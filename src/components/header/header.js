import React, { useEffect, useState, useRef } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import './header.css'
import ThemeConfig from '../../theme/themeConfig';
import { GetUserData, Logout } from "../../services/calls.js";
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import ArrowRightRoundedIcon from '@mui/icons-material/ArrowRightRounded';
import { useNavigate } from "react-router-dom";

export const Header = ({ data }) => {
    const [userDetails, setUserDetails] = useState([null])
    const [userPermission, setUserPermission] = useState([])


    const locationPage = window.location.pathname;

    // Remove a barra inicial se estiver presente
    const adjustedLocationPage = locationPage.startsWith('/') ? locationPage.slice(1) : locationPage;    const [isOpen, setIsOpen] = useState(false);

    const [isOpen2, setIsOpen2] = useState(false);
    const dropdownRef = useRef(null);
    const dropdownRef2 = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleClickOutside2 = (event) => {
        if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
            setIsOpen2(false);
        }
    };

    async function LogoutSession() {
        const logoutResp = await Logout();
        if (logoutResp.status === 1) {
            navigate("/");
        }
    }


    const hasServicePermission = (serviceName) => {
        if (!userPermission || userPermission.length === 0) return false;
        for (let i = 0; i < userPermission.length; i++) {
            if (userPermission[i].service_name.toLowerCase().includes(serviceName.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    useEffect(() => {

        if (data) {
            setUserDetails(data.userInfo ? data.userInfo[0] : null);
            setUserPermission(data.availableServices || []);
        }
        // Adiciona o ouvinte de eventos quando o componente é montado
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutside2);

        // Remove o ouvinte de eventos quando o componente é desmontado
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutside2);

        };

    }, [data]);




    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const toggleDropdown2 = () => {
        setIsOpen2((prev) => !prev);
    };

    return (
        <div className="headerMenu">
            <div className="mobileMenuAndTitle">
                <div className='mobileMenu' ref={dropdownRef}>
                    <button className='mobileDropdownButton' onClick={toggleDropdown}><MenuOutlinedIcon /></button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <ul>
                                <li><a href="/dashboard">Dashboard</a></li>

                                {hasServicePermission("User Management") && (
                                <li>
                                    <a href="/user">
                                        Users
                                    </a>
                                </li>
                                )}
                                {hasServicePermission("Permission Management") && (
                                <li>
                                    <a href="/permission">
                                    Permissions
                                    </a>
                                </li>
                                )}
                                {hasServicePermission("Lineup General Management") && (
                                <li>
                                    <a href="/lineup">
                                    Lineup
                                    </a>
                                </li>
                                )}
                                {hasServicePermission("Smtp Management") && (
                                <li>
                                    <a href="/smtp">
                                    SMTP Config
                                    </a>
                                </li>
                                )}
                                {hasServicePermission("Service Management") && (
                                <li>
                                    <a href="/service">
                                    Services
                                    </a>
                                </li>
                                )}
                                {hasServicePermission("Report") && (
                                <li>
                                    <a href="/report">
                                    Reports
                                    </a>
                                </li>
                                )}

                            </ul>
                        </div>
                    )}
                </div>
                <h3 className='headerTitleSpace'>{adjustedLocationPage}</h3>
            </div>


            <div className="logoutContainer">
                <div className='themeContainerMenu'>
                    <ThemeConfig />
                </div>

                <div className='menuDivisor'></div>

                <div className='logoutProfileMenu'>
                    <div className='profileMenu' ref={dropdownRef2}>
                        <button className='mobileDropdownButtonProfile' onClick={toggleDropdown2}>
                            <p>{userDetails.username}</p>
                            {isOpen2 === true
                                ?
                                <ArrowRightRoundedIcon />
                                :
                                <ArrowDropDownRoundedIcon />
                            }
                        </button>
                        {isOpen2 && (
                            <div className="dropdown-menu-profile">
                                <ul>
                                    <li>
                                        <span>Olá,</span>
                                        <h4>{userDetails.name + " " + userDetails.lastname}</h4>
                                    </li>
                                    <li>
                                        <span>Email:</span>
                                        <h4>{userDetails.email}</h4>
                                    </li>
                                    <li>
                                        <span>Permissão:</span>
                                        <h4>{userDetails.type_user}</h4>
                                    </li>

                                    <li><button onClick={LogoutSession}>Encerrar Sessão</button></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}