import { label } from 'aws-amplify';
import React, { useMemo } from 'react';
import { FC, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import LinkCard from '../../LinkCard/LinkCard';
import { NavDropDownContext } from '../../nav/NavBarLink/NavBarLink';
import { AuthContext } from '../../route/AuthGuardRoute';
import TabbedCard from '../../Tabbedcard/TabbedCard';
import './YourWork.css';

interface YourWorkProps{
    hideFooter?: boolean;
}

const YourWork: FC<YourWorkProps> = (props) => {
    const {setDropdown} = useContext(NavDropDownContext);
    const location = useLocation();
    const userPrefs = useSelector((state: RootState) => state.userPrefs);
    const defaultUserPrefs = useMemo(() => userPrefs.values.find(pref => pref.id === 'default'), [userPrefs]);
    const issues = useSelector((state: RootState) => state.issues);
    const projects = useSelector((state: RootState) => state.projects);
    const {authUser} = useContext(AuthContext)

    const handleClickOption = (item: any) => {
        setDropdown(false);
    }
    const assignedToMeLinks = [
        {
            label: 'Given Label',
            value: 'givenLabel1',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
        },
        {
            label: 'Given Label',
            value: 'givenLabel2',
            bsIcon: 'bookmark-star',
            caption: 'Software module',
            actions: [
                {
                    label: 'favorite',
                    value:'favorite',
                    bsIcon: 'star',
                    flipBsIcon: 'star-fill',
                    handleClick: (event: any) => {}
                },
                {
                    label: 'view-later',
                    value:'favorite',
                    bsIcon: 'hourglass',
                    handleClick: (event: any) => {}
                }
            ]
        }
    ]
    const tabs =[
        {
            label: 'Assigned to me',
            bodyElement: (
                <React.Fragment>
                    <LinkCard 
                        label='To Do'
                        showLabel={true}
                        isLoading={false}
                        linkItems={issues.values
                            .filter(issue => issue.assignee === authUser.data?.attributes.email)
                            .map(issue => ({
                            label: issue.label,
                            caption: [
                                `${issue.projectKey}-${issue.id}`, 
                                projects.values.find(project => project.key === issue.projectKey)?.name || ''
                            ],
                            value: issue.id,
                            href: `//${window.location.host}/myp/projects/${issue.projectKey}/issue?issueId=${issue.id}`
                        }))}
                        handleClick={handleClickOption}
                    />
                </React.Fragment>
            ),
            footerElement: (
                <LinkCard 
                    label='footer1'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'Go to Your Work Page',
                            value: 'go-to-your-work-page',
                            href: '/myp/your-work'
                        }
                    ]}
                    handleClick={handleClickOption}
                />
            )
        },
        {
            label: 'Recent',
            bodyElement: (
                <React.Fragment>
                    <LinkCard 
                        label='Viewed'
                        showLabel={true}
                        isLoading={false}
                        linkItems={projects.values
                            .filter(project => (defaultUserPrefs?.recentViewedProjects || []).findIndex(p => p === project.id) >=0 )
                            .map(project => ({
                                label: project.name,
                                caption: [project.key],
                                value: project.key,
                                href: `//${window.location.host}/myp/projects/${project.key}/board`
                            }))
                            .concat(issues.values
                                .filter(issue => (defaultUserPrefs?.recentViewedIssues || []).findIndex(p => p === issue.id) >=0 )
                                .map(issue => ({
                                label: issue.label,
                                caption: [
                                    `${issue.projectKey}-${issue.id}`, 
                                    projects.values.find(project => project.key === issue.projectKey)?.name || ''
                                ],
                                value: issue.id,
                                href: `//${window.location.host}/myp/projects/${issue.projectKey}/issue?issueId=${issue.id}`
                            })))
                        }
                        handleClick={handleClickOption}
                    />
                </React.Fragment>
            ),
            footerElement: (
                <LinkCard 
                    label='footer1'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'Go to Your Work Page',
                            value: 'go-to-your-work-page',
                            href: '/myp/your-work'
                        }
                    ]}
                    handleClick={handleClickOption}
                />
            )
        },
        {
            label: 'Boards',
            bodyElement: (
                <div></div>
            ),
            footerElement: (
                <LinkCard 
                    label='footer1'
                    showLabel={false}
                    isLoading={false}
                    linkItems={[
                        {
                            label: 'View all boards',
                            value: 'view-all-boards',
                            href: '/myp/boards'
                        }
                    ]}
                    handleClick={()=>{}}
                />
            )
        },
    ];
    return (
        <div>
            <TabbedCard
                tabItems={props.hideFooter? tabs.map(tab => ({label: tab.label, bodyElement: tab.bodyElement})): tabs}
            />
        </div>
    )
}

export default YourWork;