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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login"
                    element ={
                        <DefaultRoute element={<LoginPage />} />
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
    );
}

export default App;
