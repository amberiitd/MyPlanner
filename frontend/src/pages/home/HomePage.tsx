import path from 'path';
import { FC } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavBarMain from '../../components/nav/NavBarMain/NavBarMain';
import Projects from '../Projects/Projects';
import WorkPage from '../WorkPage/WorkPage';
import { useState, useEffect } from 'react';
import './HomePage.css';
import projectModalService from '../../modal.service';
import ProjectModal from '../../components/dropdowns/Projects/ProjectModal/ProjectModal';
import { useQuery } from '../../hooks/useQuery';
import { CrudPayload, UserPref } from '../../model/types';
import { commonCrud } from '../../services/api';
import { useDispatch } from 'react-redux';
import { refreshUserPref } from '../../app/slices/userPrefSlice';

interface HomePageProps{

}

const HomePage: FC<HomePageProps> = (props) => {
    const [showProjectModal, setShowProjectModal] = useState(projectModalService.getShowModal());
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const dispatch = useDispatch();
    useEffect(()=>{
        projectModalService.subscribe(()=>{
            setShowProjectModal(projectModalService.getShowModal());
        })
        commonQuery.trigger({
            action: 'RETRIEVE',
            data: {},
            itemType: 'userPref'
        } as CrudPayload)
        .then((res) => {
            dispatch(refreshUserPref(res as UserPref[]));
        })
    }, [])

    return (
        <div className='container-fluid font-theme p-0 m-0 h-100'>
            <NavBarMain />
            <Routes>
                <Route path='your-work' element={<WorkPage />} />
                <Route path='projects/*' element={<Projects />} />
                <Route path='*' element={ <Navigate to='your-work' />} />
            </Routes>
            <ProjectModal 
                showModal={showProjectModal}
                handleCancel={()=>{projectModalService.setShowModel(false)}}
            />
        </div>
    )
}

export default HomePage;