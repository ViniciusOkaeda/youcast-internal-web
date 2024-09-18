import React, { useState, useEffect } from "react";
import "./menu.css";
import Logo from '../../assets/Logo_youcast_branco.png';
import AppsOutlinedIcon from '@mui/icons-material/AppsOutlined';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import FactCheckRoundedIcon from '@mui/icons-material/FactCheckRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import MailLockRoundedIcon from '@mui/icons-material/MailLockRounded';
import AssessmentRoundedIcon from '@mui/icons-material/AssessmentRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import MediationOutlinedIcon from '@mui/icons-material/MediationOutlined';

export const Menu = ({ data }) => {
    const locationPage = window.location.pathname.replace(/\//g, '');
    const [userPermission, setUserPermission] = useState([]);

    useEffect(() => {
        if (data) {
            setUserPermission(data);
        }
    }, [data]);

    // Função para verificar se o serviço está disponível
    const hasServicePermission = (serviceName) => {
        if (!data || data.length === 0) return false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].service_name.toLowerCase().includes(serviceName.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="containerMenu">
            <div className="containerProfile">
                <img src={Logo} alt="Logo" />
            </div>

            <div className="containerOptions">
                <a href="/dashboard" className={locationPage === "dashboard" ? "optionsWithBackground" : "options"}>
                    <div className="optionsIcon">
                        <AppsOutlinedIcon />
                    </div>
                    <div className="optionsText">
                        <p>Dashboard</p>
                    </div>
                </a>

                {hasServicePermission("User Management") && (
                    <a href="/user" className={locationPage === "user" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <PersonRoundedIcon />
                        </div>
                        <div className="optionsText">
                            <p>Users</p>
                        </div>
                    </a>
                )}


                {hasServicePermission("Permission Management") && (
                    <a href="/permission" className={locationPage === "permission" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <MediationOutlinedIcon />
                        </div>
                        <div className="optionsText">
                            <p>Permissions</p>
                        </div>
                    </a>
                )}
                {hasServicePermission("Lineup General Management") && (
                    <a href="/lineup" className={locationPage === "lineup" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <FactCheckRoundedIcon />
                        </div>
                        <div className="optionsText">
                            <p>Lineup</p>
                        </div>
                    </a>
                )}


                {hasServicePermission("Smtp Management") && (

                    <a href="/smtp" className={locationPage === "smtp" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <MailLockRoundedIcon />
                        </div>
                        <div className="optionsText">
                            <p>SMTP Config</p>
                        </div>
                    </a>
                )}

                {hasServicePermission("Service Management") && (

                    <a href="/service" className={locationPage === "service" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <ConstructionRoundedIcon />
                        </div>
                        <div className="optionsText">
                            <p>Services</p>
                        </div>
                    </a>
                )}

                {hasServicePermission("Report") && (

                    <a href="/report" className={locationPage === "report" ? "optionsWithBackground" : "options"}>
                        <div className="optionsIcon">
                            <AssessmentRoundedIcon />
                        </div>
                        <div className="optionsText">
                            <p>Reports</p>
                        </div>
                    </a>
                )}
            </div>
        </div>
    );
};