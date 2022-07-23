import { FC } from 'react';
import LinkCard from '../../components/LinkCard/LinkCard';
import './WorkPage.css';

interface WorkPageProps{

}

const WorkPage: FC<WorkPageProps> = () => {

    return (
        <div className='border'>
            <LinkCard 
                label='Card Label'
                showLabel={true}
                isLoading={false}
                linkItems={[]}
            />
            {/* <div style={{border: '5px solid coral'}}> Border Test</div> */}
        </div>
    )
};

export default WorkPage;