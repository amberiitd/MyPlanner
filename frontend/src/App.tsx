import './App.css';
import {
    BrowserRouter,
    Routes,
    Navigate,
    Route,
    Link
  } from "react-router-dom";
import LoginPage from './pages/LoginPage/LoginPage';
import PageNotFound from './components/PageNotFound/PageNotFound';
import AuthGuardRoute from './components/route/AuthGuardRoute';
import DefaultRoute from './components/route/DefaultRoute';
import HomePage from './pages/home/HomePage';
import { Modal } from 'react-bootstrap';
import Button from './components/Button/Button';
import { Amplify } from 'aws-amplify';
import { Provider } from 'react-redux';
import { store } from './app/store';

const awsConfig = {
    Auth: {
      userPoolId: process.env.REACT_APP_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID,
      identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
      region: 'ap-south-1',
    },
    API: {
      endpoints: [
        {
          name: 'base_url',
          endpoint: `${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_STAGE}`,
          region: 'ap-south-1',
        }
      ],
    },
};
  
Amplify.configure(awsConfig);


function App() {
    return (
        <div className='h-100'>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login"
                            element ={
                                <LoginPage />
                            }
                        />
                        <Route path='/myp/*' 
                            element={
                                <AuthGuardRoute
                                    element={
                                        <HomePage />
                                    }
                                />
                            }
                        />
                        <Route path="/page-not-found" element={<PageNotFound />} />
                        <Route path="*" element={<Navigate to="/login"/>} />
                    </Routes>
                </BrowserRouter>
            </Provider>
        </div>  
    );
}

export default App;
