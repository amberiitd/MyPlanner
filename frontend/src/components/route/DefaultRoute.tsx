import React, { FC } from 'react';
import { Route, Navigate, useLocation } from "react-router-dom";

interface SimpleNavigator {
    validate: () => boolean;
    defaultPath: string;
}
const DefaultRoute = (props: { element: JSX.Element }) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const navigation: {
        [key: string]: SimpleNavigator;
    } = {
        '/myp/login': {
            validate: () => {
                return true;
            },
            defaultPath: '/myp/home'
        }
    };

    const defaultNavigation: SimpleNavigator = {
        validate: () => {
            return true;
        },
        defaultPath: '/myp/home'
    };

    const pathNav = navigation[currentPath] || defaultNavigation;
    return pathNav.validate()
        ? props.element
        : <Navigate to={pathNav.defaultPath} />
}

export default DefaultRoute;