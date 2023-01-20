import { uniqueId } from 'lodash';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { SimpleAction } from '../../../../model/types';
import Button from '../../../Button/Button';
import DropdownAction from '../../../DropdownAction/DropdownAction';
import { TextEditorContext } from '../TextEditor';
import './TextFormats.css';

interface TextFormatsProps{
    formatList: Format[];
    currentStyles: string[];
    onToggle: (format: Format) => void;
}

export interface Format extends SimpleAction{
    bsIcon: string;
    style: 'BOLD' | 'ITALIC' | 'UNDERLINE' | 'STRIKETHROUGH' | 'CODE' | 'SUBSCRIPT' | 'SUPERSCRIPT';
    shortcutBsIcons?: string[];
}

const TextFormats: FC<TextFormatsProps> = (props) => {
    const [offset, setOffset] = useState(2);
    const textContainerWidth = useContext(TextEditorContext).containerWidth;

    useEffect(() => {
        // console.log('textContainerwidth changed')
        if (textContainerWidth && textContainerWidth > 400){
            setOffset(2)
        }else{
            setOffset(0)
        }
    }, [textContainerWidth])

    return (
        <div className='d-flex flex-nowrap'>
            
            {
                props.formatList.slice(0, offset).map(format => (
                    <div className='' key={uniqueId()}>
                        <Button 
                            label={format.label} 
                            hideLabel={true}
                            leftBsIcon={format.bsIcon}
                            handleClick={() =>{props.onToggle(format)}}
                            tooltip={format.label}
                            extraClasses={`p-1 px-2 ${props.currentStyles.includes(format.style)? "btn-as-thm":"btn-as-bg"}`}
                        />
                        {/* <button type="button" id="paste" value="" unselectable="on" onClick={() =>{props.onChange(format)}}> Paste HTML</button> */}
                    </div>
                    
                ))
            }
            <div className='ms-1 me-2' unselectable="on" title={'Formats'}>
                <DropdownAction 
                    actionCategory={[{
                        label: 'Formats',
                        value: 'formats',
                        items: props.formatList.slice(offset),
                        selectedItems: props.formatList.slice(offset).filter(item => props.currentStyles.includes(item.style))
                    }]} 
                    buttonClass={props.formatList.slice(offset).some(f => props.currentStyles.includes(f.style))? 'btn-as-thm p-1 ps-2': 'btn-as-bg p-1 ps-2'}
                    bsIcon='three-dots'
                    handleItemClick={(event) => {props.onToggle(event.item as Format)}}
                />
            </div>
            
        </div>
    )
}

export default TextFormats;