/* eslint-disable react/react-in-jsx-scope */
import logo from './logo1.png';
import './App.css';
import {
    BrowserRouter,
    Routes,
    Navigate,
    Route,
    Link
  } from "react-router-dom";
import LoginPage from './components/login/LoginPage/LoginPage.tsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/myp/login" element ={<LoginPage></LoginPage>}/>
                <Route path="/myp/home"
                    element={
                        <div className="App">
                            <header className="">
                            <img src={logo} alt="logo" />
                            <a href='#'>
                                Welcome to MyPlanner
                            </a>
                            </header>
                        </div>
                    }
                />
                <Route path="*" element={<Navigate to="/myp/home"/>} />
            </Routes>
        </BrowserRouter>       
    );
}

export default App;
