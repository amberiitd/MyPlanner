import { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import Select from '../../input/Select/Select';
import './Project.css';

interface ProjectProps{
    onChange: (value: {id: string, key: string}) => void;
}

const Project: FC<ProjectProps> = (props) => {
    const userPrefs = useSelector((state: RootState) => state.userPrefs);
    const defaultUserPrefs = useMemo(() => userPrefs.values.find(pref => pref.id === 'default'), [userPrefs]);
    const projects = useSelector((state: RootState) => state.projects);
    
    return (
        <div>
            <Select 
                label='Project'
                data={[
                    {
                        label: 'Recent Projects',
                        items: projects.values
                        .filter(project => (defaultUserPrefs?.recentViewedProjects || []).findIndex(p => p === project.id) >=0 )
                        .map(project => ({
                            label: project.name,
                            caption: [project.key],
                            value: project.id,
                        })),
                        showLabel: true
                    },
                    {
                        label: 'All Projects',
                        items: projects.values.map(project => ({
                            label: project.name,
                            caption: [project.key],
                            value: project.id,
                        })),
                        showLabel: true
                    },
                ]}
                isRequired={true}
                onSelectionChange={(item)=> {
                    const project = projects.values.find(p => p.id === item.value);
                    props.onChange({id: project?.id || '', key: project?.key || ''})
                }}
            />
        </div>
    )
}

export default Project;