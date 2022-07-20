import React, { FC } from 'react';
import { Route, Navigate } from "react-router-dom";

const AuthGuardRoute = (props: {element: JSX.Element}) => (
        true? props.element : <Navigate to='/myp/login' />
)

export default AuthGuardRoute;