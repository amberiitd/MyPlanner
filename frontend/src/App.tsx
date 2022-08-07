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

function App() {
    return (
        <div className='h-100'>
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
            {/* <Modal
                show={false}
                fullscreen={'md-down'}
                backdrop='static'
                dialogClassName='modal-dialog-scrollable font-theme'
            >
                <Modal.Body>
                    <div className='row border'>
                        <div className='col-4 sidebar h-100 border'>
                        <div className='d-flex flex-nowrap p-3 border'>
                            <Button 
                                label='Cancel'
                                hideLabel={true}
                                bsIcon='x-lg'
                                extraClasses='bg-light'
                                handleClick={props.handleCancel}                
                            />
                        </div>
                        </div>
                        <div className='col-auto h-100 border'>

                        </div>

                    </div>
                </Modal.Body>
            </Modal> */}
        </div>  
    );
}

export default App;
