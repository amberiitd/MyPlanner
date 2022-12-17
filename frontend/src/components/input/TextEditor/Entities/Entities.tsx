import { CompositeDecorator } from 'draft-js';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
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
    onEmojiInput: (entity: any) => void;
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
            bsIcon: 'link-45deg',
            htmlId: 'editor-link-toggler'
        },
        {
            label: 'Emoji',
            value: 'emoji',
            bsIcon: 'emoji-smile',
            htmlId: 'editor-emoji-toggler'
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
        const handleClick = (e: any)=>{
            if (emojiRef.current && emojiRef.current.contains(e.target)){

            }else if (e.target.parentNode.id !== 'editor-emoji-toggler'){
                setEmojiDropdown(false);
            }
        };
        window.addEventListener('click', handleClick);
        return () => { window.removeEventListener('click', handleClick)};
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

    const onInsertEmoji = (emoji: EmojiClickData) => {
        const entity = {
            type: 'EMOJI',
            mutability: 'IMMUTABLE',
            data: {
                ...emoji,
                label: emoji.emoji,
                imgUrl: emoji.getImageUrl(EmojiStyle.APPLE)
            }
        }
        props.onEmojiInput(entity);
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
            <div className='ms-1 me-2' unselectable="on" title={'Inserts'}>
                <DropdownAction 
                    actionCategory={[{
                        label: 'Inserts',
                        value: 'inserts',
                        items: insertList.slice(offset)
                    }]} 
                    
                    handleItemClick={(event) => {interceptInsert(event.item as Insert)}}
                />
            </div>
                
            {
                emojiDropdown &&
                <div ref={emojiRef} className={`position-absolute rounded-3 p-0 end-0 top-100 show`}>
                    <EmojiPicker 
                        onEmojiClick={onInsertEmoji}
                    />
                </div>
            }
        </div>
    )
}

export default Entities;