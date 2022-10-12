import { uniqueId } from 'lodash';
import { FC } from 'react';
import { SimpleAction } from '../../../../model/types';
import Button from '../../../Button/Button';
import { BlockType } from '../TextEditor';
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

    return (
        <div>
            <div className='d-flex flex-nowrap mx-2'>
                {
                    props.styleList.map(item => (
                        <Button 
                            key={uniqueId()}
                            label={'Bulleted list'} 
                            hideLabel={true}
                            rightBsIcon={item.rightBsIcon}
                            disabled={props.selectedStyle.category === 'text' && props.selectedStyle.value !== 'unstyle'}
                            extraClasses={`${props.selectedStyle.value === item.value ? 'btn-as-thm':'btn-as-bg'} pe-1 ps-2 py-1 mx-1`}
                            handleClick={()=>{props.onChange(item)}}
                        />
                    ))
                }
            </div>
        </div>
    )
}

export default ListStyles;