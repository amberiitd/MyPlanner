import { label } from 'aws-amplify';
import { uniqueId } from 'lodash';
import { FC, useCallback } from 'react';
import ButtonCircle from '../../../../../components/ButtonCircle/ButtonCircle';
import { LinkItem } from '../../../../../components/LinkCard/LinkCard';
import './ButtonMultiSelect.css';
import DropdownButtonMultiSelect from './DropdownMultiButtonSelect';

interface ButtonMultiSelectProps{
    items: LinkItem[];
    selectedItems: LinkItem[];
    onSelectionChange: (items: LinkItem[]) => void;
}

const ButtonMultiSelect: FC<ButtonMultiSelectProps> = (props) => {
    const layoutCount = 3;
    const overlap = '-10px'
    const handleSelection = useCallback((item: any) => {
        let newSelection;
        const index = props.selectedItems.findIndex(selection => selection.value === item.value);
        if (index >=0){
            props.selectedItems.splice(index, 1);
            newSelection = props.selectedItems;
        }
        else{
            props.selectedItems.push(item);
            newSelection = props.selectedItems;
        }
        
        props.onSelectionChange([...newSelection]);
    }, [props.selectedItems])

    return (
        <div className='d-flex flex-nowrap'>
            {
                props.items.slice(0, layoutCount).map((item, index) => (
                    <div key={`button-multiselect-${index}`} className='' style={{marginLeft: overlap}}>
                        <ButtonCircle 
                            label={item.label?.split(' ').map(p => p[0]).join('') || 'A'}
                            showLabel={true} 
                            onClick={() => {handleSelection(item)}}
                            size='md'
                            extraClasses={`${props.selectedItems.findIndex(it => it.value === item.value) >=0 ? 'bg-thm-2': 'bg-light text-muted border'}`}
                        />
                    </div>
                ))
            }
            <div className='' hidden={props.items.length <= layoutCount} style={{marginLeft: overlap}}>
                <DropdownButtonMultiSelect 
                    label={''} 
                    data={[ {
                        label: 'People',
                        items: props.items.slice(layoutCount, props.items.length).map(item => ({
                            label: item.label,
                            value: item.value
                        })),
                    }]} 
                    selectedItems={props.selectedItems}
                    onSelectionChange={props.onSelectionChange}                
                />
            </div>
        </div>
    )
}

export default ButtonMultiSelect;