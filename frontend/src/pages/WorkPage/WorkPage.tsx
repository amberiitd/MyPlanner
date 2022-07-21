import { FC } from 'react';
import LinkCard from '../../components/LinkCard/LinkCard';
import './WorkPage.css';

interface WorkPageProps{

}

const WorkPage: FC<WorkPageProps> = () => {

    return (
        <div className='border'>
            <LinkCard />

        </div>
    )
};

export default WorkPage;