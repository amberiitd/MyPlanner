import { FC } from 'react';
import './Backlog.css';
import BacklogCard from './BacklogCard/BacklogCard';

interface BacklogProps{

}

const Backlog: FC<BacklogProps>  = (props) => {

    return (
        <div>

            <div>
                <BacklogCard />
            </div>
        </div>
    )
}

export default Backlog;