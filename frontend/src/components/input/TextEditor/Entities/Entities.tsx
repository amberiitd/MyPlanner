import { CompositeDecorator } from 'draft-js';
import EmojiPicker from 'emoji-picker-react';
import { uniqueId } from 'lodash';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { SimpleAction } from '../../../../model/types';
import Button from '../../../Button/Button';
import DropdownAction from '../../../DropdownAction/DropdownAction';
import { TextEditorContext } from '../TextEditor';
import { Format } from '../TextFormats/TextFormats';
import './Entities.css';

export interface Insert extends SimpleAction{
    bsIcon: string;
}

interface EntitiesProps{
    linkPopup: boolean;
    onSelect: (insert: Insert) => void;
}
const Entities: FC<EntitiesProps> = (props) => {
    const [offset, setOffset] = useState(0);
    const textContainerWidth = useContext(TextEditorContext).containerWidth;
    const [emojiDropdown, setEmojiDropdown] = useState(false);
    const emojiRef = useRef<HTMLDivElement>(null);
    const insertList: Insert[] =[
        {
            label: 'Link',
            value: 'link',
            bsIcon: 'link-45deg'
        },
        {
            label: 'Emoji',
            value: 'emoji',
            bsIcon: 'emoji-smile'
        }
    ]
    useEffect(() => {
        if (textContainerWidth && textContainerWidth > 680){
            setOffset(3)
        }
        else if (textContainerWidth && textContainerWidth > 500){
            setOffset(2)
        }
        else{
            setOffset(0)
        }
    }, [textContainerWidth])

    useEffect(() => {
        window.addEventListener('click', (e: any)=>{
            if (emojiRef.current && emojiRef.current.contains(e.target)){

            }else{
                setEmojiDropdown(false);
            }
        })
    }, [])

    const interceptInsert = (insert: Insert) => {
        switch(insert.value){
            case 'link':
                props.onSelect(insert);
                break;
            case 'emoji':
                setEmojiDropdown(true);
                break;
            default:
                break
        }
    }

    return (
        <div className='dropdown dropend d-flex flex-nowrap'>
            {
                insertList.slice(0, offset).map(insert => (
                    <div className='ms-1' key={uniqueId()}>
                        <Button 
                            label={insert.label} 
                            hideLabel={true}
                            leftBsIcon={insert.bsIcon}
                            handleClick={() =>{interceptInsert(insert)}}
                            disabled={(insert.value === 'link' && props.linkPopup)}
                            tooltip={insert.label}
                            extraClasses={`ps-2 py-1 ${"btn-as-bg"}`}
                        />
                    </div>
                ))
            }
            <div className='ms-1 me-2' unselectable="on" title={'Formats'}>
                <DropdownAction 
                    actionCategory={[{
                        label: 'Inserts',
                        value: 'inserts',
                        items: insertList.slice(offset)
                    }]} 
                    handleItemClick={(event) => {interceptInsert(event.item as Insert)}}
                />
            </div>
                
            <div ref={emojiRef} className={`dropdown-menu rounded-3 p-0 end-0 top-100 ${emojiDropdown? 'show': ''}`}>
                <EmojiPicker 
                    onEmojiClick={(emoji) => console.log(emoji)}
                />
            </div>
        </div>
    )
}

export default Entities;