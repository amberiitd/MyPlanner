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

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/myp/login"
                    element ={
                        <DefaultRoute element={<LoginPage />} />
                    }
                />
                <Route path='/myp/home' 
                    element={
                        <AuthGuardRoute
                            element={
                                <div className="App">
                                    <header className="">
                                    <img src="" alt="logo" />
                                    <a href='#'>
                                        Welcome to MyPlanner
                                    </a>
                                    </header>
                                </div>
                            }
                        />
                    }
                />
                <Route path="/myp/page-not-found" element={<PageNotFound />} />
                <Route path="*" element={<Navigate to="/myp/login"/>} />
            </Routes>
        </BrowserRouter>       
    );
}

export default App;
