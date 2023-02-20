import { uniqueId } from 'lodash';
import { FC, useContext, useEffect, useState } from 'react';
import { SimpleAction } from '../../../../model/types';
import Button from '../../../Button/Button';
import DropdownAction from '../../../DropdownAction/DropdownAction';
import { BlockType, TextEditorContext } from '../TextEditor';
import './ListStyles.css';

export interface ListStyle extends BlockType{
    rightBsIcon: string;
}

interface ListStylesProps{
    selectedStyle: ListStyle;
    styleList: ListStyle[]; 
    onChange: (style: ListStyle) => void;
}

const ListStyles: FC<ListStylesProps> = (props) => {
    const [offset, setOffset] = useState(0);
    const textContainerWidth = useContext(TextEditorContext).containerWidth;

    useEffect(() => {
        if (textContainerWidth && textContainerWidth > 450){
            setOffset(3)
        }else{
            setOffset(0)
        }
    }, [textContainerWidth])
    return (
        <div className='d-flex flex-nowrap'>
            {
                offset > 0 &&
                <div className='d-flex flex-nowrap me-1'>
                    {
                        props.styleList.slice(0, offset).map((item, index) => (
                            <div className='' key={`list-style-${index}`}>
                                <Button 
                                    label={item.label} 
                                    hideLabel={true}
                                    leftBsIcon={item.rightBsIcon}
                                    disabled={props.selectedStyle.category === 'text' && props.selectedStyle.value !== 'unstyle'}
                                    extraClasses={`${props.selectedStyle.value === item.value ? 'btn-as-thm':'btn-as-bg'} p-1`}
                                    tooltip={item.label}
                                    handleClick={()=>{props.onChange(item)}}
                                />
                            </div>
                        ))
                    }
                </div>
                
            }
            
            {
                offset < props.styleList.length && 
                <div title='Lists'>
                    <DropdownAction 
                        actionCategory={[{
                            label: 'Lists',
                            value: 'lists',
                            items: props.styleList.slice(offset),
                            selectedItems: [props.selectedStyle]
                        }]} 
                        bsIcon={'three-dots'}
                        buttonClass={props.styleList.slice(offset).map(item => item.value).includes(props.selectedStyle.value)? 'btn-as-thm  p-1 px-2': 'btn-as-bg p-1'}
                        handleItemClick={(event) => {props.onChange(event.item as ListStyle)}}
                    />
                </div>
            }
        </div>
    )
}

export default ListStyles;