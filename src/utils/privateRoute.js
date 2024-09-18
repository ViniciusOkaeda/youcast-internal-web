import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Função para verificar se o token está presente nos cookies
const isAuthenticated = () => {
    const token = Cookies.get('token'); // Nome do cookie pode variar
    return !!token; // Retorna true se o token existir
};

// Componente HOC para proteger rotas
const withAuth = (WrappedComponent) => {
    return (props) => {
        return isAuthenticated() ? (
            <WrappedComponent {...props} />
        ) : (
            <Navigate to="/login" /> 
        );
    };
};

export default withAuth;