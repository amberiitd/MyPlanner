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
            setOffset(2)
        }else{
            setOffset(0)
        }
    }, [textContainerWidth])
    return (
        <div>
            <div className='d-flex flex-nowrap mx-2'>
                {
                    offset > 0 &&
                    props.styleList.map(item => (
                        <Button 
                            key={uniqueId()}
                            label={item.label} 
                            hideLabel={true}
                            rightBsIcon={item.rightBsIcon}
                            disabled={props.selectedStyle.category === 'text' && props.selectedStyle.value !== 'unstyle'}
                            extraClasses={`${props.selectedStyle.value === item.value ? 'btn-as-thm':'btn-as-bg'} pe-1 ps-2 py-1 mx-1`}
                            tooltip={item.label}
                            handleClick={()=>{props.onChange(item)}}
                        />
                    ))
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
                            bsIcon={'caret-down'}
                            buttonClass={props.selectedStyle.category === 'list'? 'btn-as-thm  p-1 ps-2': undefined}
                            handleItemClick={(event) => {props.onChange(event.item as ListStyle)}}
                        />
                    </div>
                }
            </div>
        </div>
    )
}

export default ListStyles;