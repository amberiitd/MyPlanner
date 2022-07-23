import { FC } from 'react';
import CustomLink from '../CustomLink/CustomLink';
import './LinkCard.css';

interface LinkCardProps{
    label: string;
    showLabel: boolean;
    isLoading: boolean;
    linkItems: any[]
}

const LinkCard: FC<LinkCardProps> = (props) => {
    
    
    return (
        <div className='w-100 py-1'>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            {
                props.linkItems.map((item, index) => (
                    <CustomLink key ={`custom-link-${index}`} {...item}/>
                ))
            }
        </div>
    )
};

export default LinkCard;