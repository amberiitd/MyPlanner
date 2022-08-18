import { isEmpty } from 'lodash';
import { FC } from 'react';
import './SelectCard.css';
import SelectOption from './SelectOption/SelectOption';

interface SelectCardProps{
    label: string;
    showLabel: boolean;
    isLoading: boolean;
    items: any[];
    extraClasses?: string;
    multiSelect?: boolean;
    selectedItems: any[];
    emptyElement?: JSX.Element;
    handleClick: (event: any) => void;
}

const SelectCard: FC<SelectCardProps> = (props) => {

    return (
        <div className='w-100'>
            <div className='p-1 ps-3 label-card' hidden={!props.showLabel}>{props.label}</div>
            {
                props.items.map((item, index) => (
                    <div key ={`custom-link-${index}`} onClick={() => {props.handleClick(item)}}>
                        <SelectOption {...item} 
                            selected={props.selectedItems.findIndex(d => d.value === item.value) >=0}
                            multiSelect={props.multiSelect}
                            extraClasses={props.extraClasses}
                        />
                    </div>
                ))
            }
            <div className='' hidden={!isEmpty(props.items)}>
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
}

export default SelectCard;