import { isEmpty } from 'lodash';
import { createContext, FC, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';
import { updateUserPref } from '../../../app/slices/userPrefSlice';
import { refreshUser } from '../../../app/slices/userSlice';
import { RootState } from '../../../app/store';
import PageNotFound from '../../../components/PageNotFound/PageNotFound';
import { useQuery } from '../../../hooks/useQuery';
import { CrudPayload, EMPTY_PROJECT, Project, User } from '../../../model/types';
import { commonCrud, fetchProjectPeople } from '../../../services/api';
import CompleteSprintModal from './Backlog/CompleteSprintModal/CompleteSprintModal';
import './ProjectBoard.css';
import BacklogWrap from './wrapper/BacklogWrap';
import IssueViewWrap from './wrapper/IssueViewWrap';
import IssueTypeSettingWrap from './wrapper/ProjectSettings/IssueTypeSettingWrap';
import SprintWrap from './wrapper/SprintWrap';

interface ProjectBoardProps{

}

export const ProjectBoardContext = createContext<{
    openProject: Project | undefined;
}>({openProject: undefined});

const ProjectBoard: FC<ProjectBoardProps> = (props) => {
    const { projectKey } = useParams();
    const projects = useSelector((state: RootState) => state.projects);
    const defaultUserPrefs = useSelector((state: RootState) => state.userPrefs.values.find(pref => pref.id === 'default'));
    const dispatch = useDispatch();
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const userQuery = useQuery((payload: any) => fetchProjectPeople(payload));

    // since projectBoard is a route component, you can keep selected project as non-state const.
    const selectedProject = useMemo(()=> {
        const project = projects.values.find(p => p.key === projectKey) || EMPTY_PROJECT;
        const newRecent = [...(defaultUserPrefs?.recentViewedProjects || [])];
        if (!isEmpty(project.id)){
            const index = newRecent.findIndex(p => p === project.id);
            if (index >= 0){
                newRecent.splice(index, 1);
            }
            newRecent.splice(0, 0, project.id);
            commonQuery.trigger({
                action: 'UPDATE',
                data: {
                    id: 'default',
                    recentViewedProjects: newRecent
                },
                itemType: 'userPref'
            } as CrudPayload)
            .then(() => {
                dispatch(updateUserPref({id: 'default', data: {recentViewedProjects: newRecent}}));
            })
        }
        return project
    }, [projects]);

    useEffect(()=>{
        userQuery.trigger({projectId: selectedProject.id})
        .then(res => {
            dispatch(refreshUser(res as User[]))
        })
    }, [selectedProject])

    return (
        <ProjectBoardContext.Provider value={{openProject: selectedProject}}>
            <Routes>
                <Route path ='/board' element={<SprintWrap />}/>
                <Route path ='/backlog' element={<BacklogWrap />}/>
                <Route path ='/issue' element={<IssueViewWrap />}/>
                <Route path ='/project-settings/issue-types/:issueTypeId' element={<IssueTypeSettingWrap />}/>
                <Route path ='/project-settings/issue-types/*' element={<Navigate to={`/myp/projects/${projectKey}/project-settings/issue-types/bug-issue`} />}/>
                <Route path ='/' element={<Navigate to={`/myp/projects/${projectKey}/board`} />}/>
                <Route path ='*' element={<PageNotFound />}/>
            </Routes>
            <CompleteSprintModal />
        </ProjectBoardContext.Provider>
    )
}

export default ProjectBoard;