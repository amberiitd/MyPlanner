import { isEmpty } from 'lodash';
import { FC } from 'react';
import CustomOption from '../CustomOption/CustomOption';
import './LinkCard.css';

interface LinkCardProps{
    label: string;
    showLabel: boolean;
    isLoading: boolean;
    linkItems: any[];
    extraClasses?: string;
    emptyElement?: JSX.Element;
    handleClick: (event: any) => void;
}

const LinkCard: FC<LinkCardProps> = (props) => {
    
    
    return (
        <div className='w-100'>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            {
                props.linkItems.map((item, index) => (
                    <div key ={`custom-link-${index}`} onClick={() => {props.handleClick(item.value || item.label)}}>
                        <CustomOption {...item} extraClasses={props.extraClasses}/>
                    </div>
                ))
            }
            <div className='' hidden={!isEmpty(props.linkItems)}>
                <div className='d-flex justify-content-center'>
                    {props.emptyElement?? (
                        <div>
                            No Items.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
};

export default LinkCard;