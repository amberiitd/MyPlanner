import { FC, useState } from 'react';
import Project from '../../components/form/Project/Project';
import Select from '../../components/input/Select/Select';
import WindowSlider from '../../components/WindowSlider/WindowSlider';
import './WorkPage.css';

interface WorkPageProps{

}

const WorkPage: FC<WorkPageProps> = () => {
    return (
        <div className=''>
            <Project />
            {/* <WindowSlider /> */}
        </div>
    )
};

export default WorkPage;