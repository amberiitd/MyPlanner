import { FC } from 'react';
import CustomOption from '../CustomOption/CustomOption';
import './LinkCard.css';

interface LinkCardProps{
    label: string;
    showLabel: boolean;
    isLoading: boolean;
    linkItems: any[]
    handleClick: (event: any) => void;
}

const LinkCard: FC<LinkCardProps> = (props) => {
    
    
    return (
        <div className='w-100 py-1'>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            {
                props.linkItems.map((item, index) => (
                    <div key ={`custom-link-${index}`} onClick={() => {props.handleClick(item.value || item.label)}}>
                        <CustomOption {...item}/>
                    </div>
                ))
            }
        </div>
    )
};

export default LinkCard;