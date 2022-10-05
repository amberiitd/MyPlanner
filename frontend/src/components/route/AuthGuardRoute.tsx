import { Auth } from 'aws-amplify';
import React, { FC, useEffect, useState } from 'react';
import { Route, Navigate } from "react-router-dom";

const AuthGuardRoute = (props: {element: JSX.Element}) => {
    const [userQuery, setUserQuery] = useState<{
        loading: boolean;
        data: any
    }>({loading: true, data: null});

    useEffect(()=>{
        Auth.currentAuthenticatedUser()
        .then(res => {
            setUserQuery({loading: false, data: res})
        })
        .catch(err =>{
            console.log(err);
            setUserQuery({...userQuery, loading: false})
        })
    }, [])
    return userQuery.loading? (<div>Hello</div>): (userQuery.data?.username? props.element : <Navigate to='/login' />)
}

export default AuthGuardRoute;