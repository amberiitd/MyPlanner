import { uniqueId } from 'lodash';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { SimpleAction } from '../../../../model/types';
import { IssueViewContext } from '../../../../pages/Projects/ProjectBoard/IssueView/IssueView';
import ProjectBoard, { ProjectBoardContext } from '../../../../pages/Projects/ProjectBoard/ProjectBoard';
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
                    <div className='ms-1' key={uniqueId()}>
                        <Button 
                            label={format.label} 
                            hideLabel={true}
                            leftBsIcon={format.bsIcon}
                            handleClick={() =>{props.onToggle(format)}}
                            tooltip={format.label}
                            extraClasses={`ps-2 py-1 ${props.currentStyles.includes(format.style)? "btn-as-thm":"btn-as-bg"}`}
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
                    buttonClass={props.formatList.slice(offset).some(f => props.currentStyles.includes(f.style))? 'btn-as-thm  p-1 ps-2': undefined}
                    handleItemClick={(event) => {props.onToggle(event.item as Format)}}
                />
            </div>
            
        </div>
    )
}

export default TextFormats;