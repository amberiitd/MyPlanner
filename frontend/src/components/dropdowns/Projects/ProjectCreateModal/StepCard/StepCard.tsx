import { toLower } from 'lodash';
import { FC } from 'react';
import Button from '../../../../Button/Button';
import CardItem from './CardItem/CardItem';
import './StepCard.css';

interface StepCardProps{
    label: string;
    showLabel?: boolean;
    stepItems: {
        label: string;
        handleRefClick: (event: any) => void;
        selectedItem: {
            label: string;
            descText: string;
        };
    }[];
}

const StepCard: FC<StepCardProps> = (props) => {

    return (
        <div className='step-card rounded-4 p-3 h-100'>
            <div hidden={!props.showLabel}>
                {props.label}
            </div>
            {
                props.stepItems.map((item, index) => (
                    <div key={`step-card-item-${index}`}>
                        <div className='d-flex flex-nowrap mb-2'>
                            <div>{item.label}</div>
                            <div className='ms-auto'>
                                <Button 
                                    label={`Change ${toLower(item.label)}`}
                                    extraClasses='btn-as-bg px-3 py-1'
                                    handleClick={()=>{}}                                    
                                />
                            </div>
                        </div>
                        <div>
                            <CardItem 
                                label={item.selectedItem.label}
                                caption={item.selectedItem.descText}
                            />
                        </div>
                    </div>
                ))
            }

        </div>
    )
}

export default StepCard;