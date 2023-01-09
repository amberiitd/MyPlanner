import { uniqueId } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIssueBulk, refreshIssue, updateIssueBulk } from '../../app/slices/issueSlice';
import { refreshProject } from '../../app/slices/projectSlice';
import { RootState } from '../../app/store';
import YourWork from '../../components/dropdowns/YourWork/YourWork';
import InfoCard from '../../components/InfoCard/InfoCard';
import CircleRotate from '../../components/Loaders/CircleRotate';
import { useQuery } from '../../hooks/useQuery';
import { CrudPayload, Project } from '../../model/types';
import { fetchJoinedProjects, projectCommonCrud, projectsCrud } from '../../services/api';
import { Issue } from '../Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import './WorkPage.css';

interface WorkPageProps{

}

const WorkPage: FC<WorkPageProps> = () => {
    const projects = useSelector((state: RootState) => state.projects);
    const issues = useSelector((state: RootState) => state.issues);
    const dispatch = useDispatch();
    const projectsQuery = useQuery((payload: any)=> fetchJoinedProjects(payload));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const userPrefs = useSelector((state: RootState) => state.userPrefs);
    const defaultUserPrefs = useMemo(() => userPrefs.values.find(pref => pref.id === 'default'), [userPrefs]);

    const onRefresh = ()=> {
        projectsQuery.trigger({})
        .then(res => {
            dispatch(refreshProject(res as Project[]));
            (res as Project[]).forEach(project => {
                projectCommonQuery.trigger({
                    action: 'RETRIEVE',
                    data: {projectId: project.id,},
                    itemType: 'issue'
                } as CrudPayload)
                .then((res2)=>{
                    dispatch(addIssueBulk(res2 as Issue[]));
                });
            });
        });
    }

    useEffect(() => {
        if (!projects.loaded){
            onRefresh();
        }
    }, [])
    return (
        <div className='py-4'>
            <div className='px-5 py-2 d-flex'>
                <div className='h4'>
                    Your work
                </div>
                <div className='ms-2'>
                    <CircleRotate onReload={onRefresh} loading={projectsQuery.loading || projectCommonQuery.loading}/>
                </div>
            </div>
            <div className='bg-light py-2 px-5'>
                <div className='py-2 d-flex'>
                    <div className='h6'>Recent projects</div>
                    <a className='ms-auto' href="/myp/projects">View all projects</a>
                </div>
                <div className='d-flex '>
                    {
                        projects.values.filter(project => (defaultUserPrefs?.recentViewedProjects || []).findIndex(p => p === project.id) >= 0)
                        .map(project => (
                            <div key={uniqueId()} className='me-2'>
                                <InfoCard 
                                    title={project.name}
                                    titleHref={`projects/${project.key}/board`}
                                    caption={project.managementType}
                                    links={[
                                        {
                                            label: 'My open issues',
                                            value: 'open-issues',
                                            href: '#',
                                            metric: {
                                                count: issues.values.reduce((pre, cur)=> pre + (cur.projectKey === project.key && cur.stage !== 'done'? 1: 0), 0)
                                            }
                                        },
                                        {
                                            label: 'Done issues',
                                            value: 'done-issues',
                                            href: '#',
                                            metric: {
                                                count: issues.values.reduce((pre, cur)=> pre + (cur.projectKey === project.key && cur.stage === 'done'? 1: 0), 0)
                                            }
                                        }
                                    ]}
                                    footerActions={[{
                                        label: `${project.key} board`,
                                        value: 'board',
                                        href: `projects/${project.key}/board`
                                    }]}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='pb-2 bottom-tab'>
                <YourWork hideFooter={true}/>
            </div>
        </div>
    )
};

export default WorkPage;