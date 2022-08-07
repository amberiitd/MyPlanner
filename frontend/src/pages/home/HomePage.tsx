import path from 'path';
import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBarMain from '../../components/nav/NavBarMain/NavBarMain';
import Projects from '../Projects/Projects';
import WorkPage from '../WorkPage/WorkPage';
import './HomePage.css';

interface HomePageProps{

}

const HomePage: FC<HomePageProps> = (props) => {

    return (
        <div className='container-fluid font-theme p-0 m-0 h-100'>
            <NavBarMain />
            <Routes>
                <Route path='your-work' element={<WorkPage />} />
                <Route path='projects/*' element={<Projects />} />
                <Route path='*' element={ <Navigate to='your-work' />} />
            </Routes>
            
        </div>
    )
}

export default HomePage;