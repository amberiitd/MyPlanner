import { FC } from 'react';
import TemplateDescription from '../TemplateDescription/TemplateDescription';
import TemplateItem from '../TemplateItem/TemplateItem';
import './TemplateCard.css';

interface TemplateCardProps{
    label: string;
    description?: string;
    items: any[];
    handleClick: (event: any)=> void;
}

const TemplateCard: FC<TemplateCardProps> =(props) => {

    return (
        <div className=''>
            <div className='mb-5'>
                <TemplateDescription
                    label={props.label}
                    descText={props.description}
                />
            </div>
            <div className='d-flex justify-content-center'>
                <div className='item-list'>
                    {(props.items || []).map((item, index) => (
                        <div className='mb-3' key={`template-item-${index}`} onClick={()=>{props.handleClick(item)}}>
                            <TemplateItem 
                                {...item}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default TemplateCard;