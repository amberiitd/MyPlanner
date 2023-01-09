import { Auth } from 'aws-amplify';
import { isEmpty } from 'lodash';
import React, { createContext, FC, useEffect, useState } from 'react';
import { Route, Navigate, useSearchParams, useNavigate } from "react-router-dom";

export const AuthContext = createContext<{
    authUser: any;
    setAuthUser: React.Dispatch<React.SetStateAction<any>>;
}>({
    authUser: undefined,
    setAuthUser: () => {}
})
const AuthGuardRoute = (props: {element: JSX.Element}) => {
    const [authUser, setAuthUser] = useState<{
        loading: boolean;
        data: any
    }>({loading: true, data: null});
    const [searchParams, setSearhParams] = useSearchParams();
    const navigate = useNavigate();

    const processParams = (res: any) => {
        const email = searchParams.get('user_as');
        if (!isEmpty(email) && email !== res.attributes?.email){
            navigate(`/login?email=${email}&redirect_to=`+ btoa(window.location.href));
        }
    }
    useEffect(()=>{
        Auth.currentAuthenticatedUser()
        .then((res) => {
            processParams(res);
            setAuthUser({loading: false, data: res});
        })
        .catch(err =>{
            console.log(err);
            processParams({});
            setAuthUser({...authUser, loading: false});
        })
    }, [])
    return (
        <AuthContext.Provider value={{authUser, setAuthUser}}>
            {
                authUser.loading? (<div>Hello</div>): (authUser.data?.username? props.element : <Navigate to='/login' />)
            }
        </AuthContext.Provider>
    )
}

export default AuthGuardRoute;