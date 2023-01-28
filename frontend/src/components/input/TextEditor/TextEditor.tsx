import { CompositeDecorator, ContentBlock, ContentState, Editor, EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw, EditorBlock, AtomicBlockUtils, DraftHandleValue, BlockMap, SelectionState } from 'draft-js';
import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { SimpleAction } from '../../../model/types';
import DropdownAction from '../../DropdownAction/DropdownAction';
import './TextEditor.css';
import TextFormats, { Format } from './TextFormats/TextFormats';
import TextColors, { TextColor } from './TextColors/TextColors';
import ListStyles, { ListStyle } from './ListStyles/ListStyles';
import { isEmpty, max, uniqueId } from 'lodash';
import Mention from './Entities/Mention/Mention';
import Entities, { Insert } from './Entities/Entities';
import Link from './Entities/Link/Link';
import LinkSpan from './Entities/Link/LinkSpan/LinkSpan';
import Button from '../../Button/Button';
import { Iterable, List, OrderedMap } from 'immutable';
import { VerticalBreak } from '../../VerticalBreak/VerticalBreak';
import {getDefaultKeyBinding, KeyBindingUtil} from 'draft-js';
import DateSpan from './Entities/Date/DateSpan';
import DatePicker from './Entities/Date/Date';
import moment from 'moment';
import StatusSpan from './Entities/Status/StatusSpan';
import Status from './Entities/Status/Status';
import { Modal } from 'react-bootstrap';
import AttachmentEntity from './Entities/Attachment/AttachmentEntity';
import { AttachCard } from '../../../pages/Projects/ProjectBoard/IssueView/Attachment/Attachment';

interface TextEditorProps{
    bannerClassName?: string;
    placeholder?: string;
    open?: boolean;
    value?: {id: string; state: string | undefined;};
    onToggle?: (open: boolean) => void;
    onChange?: (data: {open: boolean; value: string;}) => void;
    onSave?: (state: string) => void;
}

export interface BlockType extends SimpleAction {
    category: 'text' | 'list' | 'block';
}


const formatList: Format[] = [
    {
        label: 'Bold',
        value: 'bold',
        style: 'BOLD',
        bsIcon: 'type-bold'
    },
    {
        label: 'Italic',
        value: 'italic',
        style: 'ITALIC',
        bsIcon: 'type-italic'
    },
    {
        label: 'Underline',
        value: 'underline',
        style: 'UNDERLINE',
        bsIcon: 'type-underline'
    },
    {
        label: 'Strikethrough',
        value: 'strikethrough',
        style: 'STRIKETHROUGH',
        bsIcon: 'type-strikethrough'
    },
    {
        label: 'code',
        value: 'code',
        style: 'CODE',
        bsIcon: 'type-code'
    },
    {
        label: 'Subscript',
        value: 'subscript',
        style: 'SUBSCRIPT',
        bsIcon: 'type-subscript'
    },
    {
        label: 'Superscript',
        value: 'superscript',
        style: 'SUPERSCRIPT',
        bsIcon: 'type-superscript'
    },
];

const textblockStyles: BlockType[] = [
    {
        label: 'Normal',
        value: 'unstyle',
        category: 'text'
    },
    {
        label: 'Header 1',
        value: 'header-one',
        category: 'text'
    },
    {
        label: 'Header 2',
        value: 'header-two',
        category: 'text'
    }
];

const textColorStyles: TextColor[] = [
    {
        label: 'Normal',
        value: 'black',
        style: 'TEXT_NORMAL'
    },
    {
        label: 'Red',
        value: 'red',
        style: 'TEXT_RED'
    },
    {
        label: 'Orange',
        value: 'orange',
        style: 'TEXT_ORANGE'
    }
];

const listStyles: ListStyle[] = [
    {
        label: 'Bulleted list',
        value: 'unordered-list-item',
        rightBsIcon: 'list-ul',
        category: 'list'
    },
    {
        label: 'Numbered list',
        value: 'ordered-list-item',
        rightBsIcon: 'list-ol',
        category: 'list'
    },
    {
        label: 'Code block',
        value: 'code-block',
        rightBsIcon: 'code',
        category: 'block'
    },
    {
        label: 'Info block',
        value: 'info-block',
        rightBsIcon: 'info-circle',
        category: 'block'
    },
    {
        label: 'Block quote',
        value: 'custom-blockquote',
        rightBsIcon: 'quote',
        category: 'block'
    }
];

const textColorMap = {
    'TEXT_RED': {
        color: 'red'
    },
    'TEXT_ORANGE': {
        color: 'orange'
    }
}

export type PopOptions = {mode: 'edit' | 'create'; entityKey?: string; label?: string;};
export type LinkPopupOptions = PopOptions & {url?: string; disableLabelEdit?: boolean;};
export type DatePopupOptions = PopOptions & {timestamp: number;};
export type StatusPopupOptions = PopOptions & {color?: string};
type LinkPopup = {show: boolean; options?: LinkPopupOptions;};
type DatePopup = {show: boolean; options?: DatePopupOptions;};
type StatusPopup = {show: boolean; options?: StatusPopupOptions;};

export const TextEditorContext = createContext<{
    containerWidth: number | undefined;
    linkPopup: LinkPopup;
    setLinkPopup: React.Dispatch<React.SetStateAction<LinkPopup>>;
    datePopup: DatePopup;
    setDatePopup: React.Dispatch<React.SetStateAction<DatePopup>>;
    statusPopup: StatusPopup;
    setStatusPopup: React.Dispatch<React.SetStateAction<StatusPopup>>;
    handleLinkEntity: (entity: any) => void;
    handleDateEntity: (entity: any) => void;
    editorState: EditorState | undefined;
}>({
    containerWidth: undefined,
    linkPopup: {show: false},
    setLinkPopup: ()=>{},
    datePopup: {show: false},
    setDatePopup: ()=>{},
    statusPopup: {show: false},
    setStatusPopup: () => {},
    handleLinkEntity: () =>{},
    handleDateEntity: () =>{},
    editorState: undefined
});

const TextEditor: FC<TextEditorProps> = (props) => {
    const observer = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(!!props.open);
    const linkPopupRef = useRef<HTMLDivElement>(null);
    const datePopupRef = useRef<HTMLDivElement>(null);
    const statusPopRef = useRef<HTMLDivElement>(null);
    const entityRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | undefined>();
    const [mentionPopup, setMentionPopup] = useState({show: false, position: [0, 0], searchText: ''});
    const [linkPopup, setLinkPopup] = useState<LinkPopup>({show: false});
    const [datePopup, setDatePopup] = useState<DatePopup>({show: false});
    const [statusPopup, setStatusPopup] = useState<StatusPopup>({show: false});
    const [attachmentModal, setAttachmentModal] = useState<{show: boolean;}>({show: false});
    const [lastSelection, setLastSelection] = useState<Selection | null>();
    const [prevVal, setPrevVal]= useState<{id: string; state: string | undefined} | undefined>();
    const decorator = new CompositeDecorator([
        {
            strategy: findMentionEntity,
            component: MentionSpan,
        },
        {
            strategy: getInsertStrategy('LINK'),
            component: LinkSpan,
        },
        {
            strategy: getInsertStrategy('DATE'),
            component: DateSpan,
        },
        {
            strategy: getInsertStrategy('STATUS'),
            component: StatusSpan,
        },
    ]);

    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty(decorator));
    
    const [currentStyles, setCurrentStyles] = useState<string[]>([]);
    const [currentBlockType, setCurrentBlockType] = useState<BlockType | undefined>();
    const [currentTextColor, setCurrentTextColor] = useState<TextColor | undefined>();

    const handleResize = useCallback(() => {
        if (
            containerRef && containerRef.current 
        ){
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, [containerRef]); 

    const onContainerObserve = (node: any)=>{
        if (observer.current) observer.current.disconnect();
        observer.current = new ResizeObserver((entries) => {
            handleResize();
        });
        if (node) observer.current.observe(node);
    };

    useEffect(() => {
        const handleClick = (e: any)=>{
            if (linkPopupRef.current?.contains(e.target) || entityRef.current?.contains(e.target) || datePopupRef.current?.contains(e.target) || statusPopRef.current?.contains(e.target)){

            }
            else if (e.target.parentNode?.id === 'editor-link-toggler'){
                // setLinkPopup({show: !linkPopup.show, position: [0, 0]})
            }
            else{
                setLinkPopup({show: false});
                setDatePopup({show: false});
                setStatusPopup({show: false});
            }
        };

        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])

    const contentRef = useRef<Editor>(null);

    const handleKeyCommand:(command: string) => DraftHandleValue = useCallback((command) => {
        let sel = editorState.getSelection();
        let newContent = editorState.getCurrentContent();
        let block = newContent.getBlockForKey(sel.getAnchorKey())
        if (command === 'split-block') {
            if (['info-block', 'custom-blockquote'].includes(block.getType())){
                if (sel.getAnchorOffset() === sel.getFocusOffset()){
                    newContent = Modifier.insertText(newContent, sel, "\n");
                }
                else{
                    newContent = Modifier.replaceText(newContent, sel, "\n");
                }
                setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
                return 'handled';
            }else{
                return 'not-handled'
            }
        }
        return 'not-handled';
    }, [editorState]);

    const handleFormatToggle = useCallback((format: Format) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, format.style));
    }, [editorState])

    const handleBlockToggle = useCallback((block: BlockType) => {
        let sel = editorState.getSelection();
        let newContent = editorState.getCurrentContent();
        const blockType = editorState.getCurrentContent().getBlockForKey(sel.getAnchorKey()).getType();

        if (block.value === currentBlockType?.value){
            if (['info-block', 'custom-blockquote'].includes(block.value)){
                setEditorState(addEmptyBlockAtSelection(editorState));
            }else{
                setEditorState(EditorState.forceSelection(RichUtils.toggleBlockType(editorState, textblockStyles[0].value), sel));
            }
        }
        else if (blockType === 'attachment'){
            setEditorState(addEmptyBlockAtSelection(editorState));
        }
        else{
            let contentState =  editorState.getCurrentContent();
            const blockAfter = contentState.getBlockAfter(sel.getAnchorKey());
            if (!blockAfter){
                setEditorState(RichUtils.toggleBlockType(addEmptyBlockAtEnd(editorState), block.value)); 
            }else{
                setEditorState(EditorState.forceSelection(RichUtils.toggleBlockType(editorState, block.value), sel));
            }
        }
    }, [editorState, currentBlockType])

    const handleTextColorToggle = useCallback((color: TextColor) => {
        if (currentTextColor && currentTextColor.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, currentTextColor.style));
        }

        if (color.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, color.style));
        }
    }, [editorState]);

    const getPopupPosition =  useCallback(() => {
        var position = [0, 0];
        const selRect = lastSelection?.rangeCount &&  lastSelection?.rangeCount > 0 ? lastSelection?.getRangeAt(0).getBoundingClientRect(): undefined;
        const editorRect =  containerRef.current?.getBoundingClientRect();
        if (selRect && editorRect && editorRect.bottom > selRect.bottom && selRect.top > editorRect.top 
            && editorRect.left < selRect.left && selRect.right < editorRect.right
        ){
            const endmargin = max([0, selRect.right+ 200 - editorRect.right]) || 0;
            position = [selRect.top+ 20, selRect.left - endmargin]
        }else if (editorRect){
            position = [editorRect.bottom - 50, editorRect.left+ 100]
        }
        return position;
    }, [containerRef, lastSelection]);

    const popupPosition = useMemo(() => getPopupPosition(), [linkPopup]);

    const handleEntityToggle = useCallback((insert: Insert)=>{
        switch(insert.value){
            case 'link':
                setLinkPopup({show: true});
                break;
            case 'date':
                handleDateEntity({mode: 'create'})
                break;
            case 'status':
                handleStatusEntity({mode: 'create'})
                break;
            case 'attachment':
                setAttachmentModal({show: true})
                break;
        }
    }, [editorState])

    // TO DO: use draft-js-plugin/mention instead 

    const removeEntity = useCallback((entity: any) =>{
        const sel = editorState.getSelection();
        let newContent = editorState.getCurrentContent();

        if (entity.entityKey){
            const contentBlock = newContent.getBlockForKey(sel.getAnchorKey());
            contentBlock.findEntityRanges(
                (character) => {
                    return entity.entityKey === character.getEntity();
                },
                (start: number, end: number) => {
                    const oldLabelSel = sel.merge({
                        anchorOffset: start,
                        focusOffset: end
                    })
                    newContent = Modifier.applyEntity(newContent, oldLabelSel,  null);
                    newContent = Modifier.replaceText(newContent, oldLabelSel, '', undefined, undefined);
                    // console.log(newContent.getEntity(entity.entityKey));
                }
            );
        }

        return newContent;
    }, [editorState])

    const editEntity = useCallback((entity: any)=>{
        let sel = editorState.getSelection();
        let newContent: ContentState = editorState.getCurrentContent();
        if (entity.mode === 'edit' && entity.entityKey){
            newContent = newContent.mergeEntityData(entity.entityKey, {
                ...entity.data
            });

            const contentBlock = newContent.getBlockForKey(sel.getAnchorKey());
            contentBlock.findEntityRanges(
                (character) => {
                    return entity.entityKey === character.getEntity();
                },
                (start: number, end: number) => {
                    const oldLabelSel = sel.merge({
                        anchorOffset: start,
                        focusOffset: end
                    })
                    newContent = Modifier.replaceText(newContent, oldLabelSel, entity.data.label, undefined, entity.entityKey);
                }
            );
        }
        return newContent;
    },[editorState])

    const createEntity = useCallback((entity: any)=>{
        let contentState = editorState.getCurrentContent();
        let sel = editorState.getSelection();
        let newContent: ContentState;
        let newState = editorState;

        if(sel.getAnchorOffset() !== sel.getFocusOffset()) return {contentState, entityKey: undefined};

        const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        newContent = Modifier.insertText(contentState, sel, entity.data.label || entity.data.url, undefined, entityKey);
        newState = EditorState.push(editorState, newContent, 'insert-characters');

        sel = newState.getSelection();

        return { contentState: Modifier.insertText(newState.getCurrentContent(), sel, " "), entityKey} ;
    }, [editorState])

    const handleMentionEntity = useCallback((entity: any) => {
        if (!entity){
            setMentionPopup({show: false, position: [0, 0], searchText: ''})
            return;
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const sel = editorState.getSelection();

        const blockText = contentState.getBlockForKey(sel.getStartKey()).getText();
        const beforeSelectionText = blockText.slice(0, sel.getStartOffset()) ;
        const words = beforeSelectionText.split(" ");
        const lastWord = words[words.length-1];

        let newSelection = sel.merge({
            anchorOffset: sel.getStartOffset() -lastWord.length,
            focusOffset: sel.getStartOffset()
        });
        let newContent = Modifier.replaceText(contentStateWithEntity, newSelection, entity.data.label, undefined, entityKey);
        let newState = EditorState.push(editorState, newContent, 'insert-characters');
        setEditorState(newState);

        // newSelection = newState.getSelection();
        newContent = Modifier.insertText(newContent, newState.getSelection(), " ");
        setEditorState(EditorState.push(newState, newContent, 'insert-characters'));

        setMentionPopup({show: false, position: [0, 0], searchText: ''})
    }, [editorState])

    const handleLinkEntity = useCallback((entity: any) => {
        if (!entity){
            setLinkPopup({show: false})
            return;
        }
        let sel = editorState.getSelection();
        let newContent: ContentState;
        let newState = editorState;

        if (entity.mode === 'edit' && entity.entityKey){
            newContent = editEntity({...entity, label: entity.data.label || entity.data.url});
        }
        else if (entity.mode === 'delete' && entity.entityKey){
            newContent = removeEntity(entity);
        }
        else{
            const createResp = createEntity({...entity, label: entity.data.label || entity.data.url});
            newContent = createResp.contentState;
        }

        newState = EditorState.push(newState, newContent, 'insert-characters');
        sel = newState.getSelection();
        setLinkPopup({show: false});
        setTimeout(()=>{
            setEditorState(EditorState.forceSelection(newState, sel));
        }, 200);
    }, [editorState, contentRef])

    const handleEmojiEntity = useCallback((entity: any) => {
        if (!entity){
            return;
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const sel = editorState.getSelection();

        let newContent = Modifier.insertText(contentState, sel, entity.data.label, undefined, entityKey);
        setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
    }, [editorState])

    const handleDateEntity = useCallback((entity: any)=>{
        if (!entity){
            return;
        }
        let sel = editorState.getSelection();
        let newContent: ContentState;
        let newState = editorState;

        if (entity.mode === 'edit' && entity.entityKey){
            newContent = editEntity(entity);
            setDatePopup({show: false});
        }
        else if (entity.mode === 'delete' && entity.entityKey){
            newContent = removeEntity(entity);
            setDatePopup({show: false});
        }
        else{
            entity= {
                ...entity, 
                type: 'DATE',
                mutability: 'IMMUTABLE', 
                data:{ 
                    label: moment().format('YYYY-MM-DD'), 
                    timestamp: moment().unix() 
                }
            };
            const createResp = createEntity(entity);
            newContent = createResp.contentState;
            setDatePopup({show: true, options: {mode: 'edit', entityKey: createResp.entityKey, label: entity.data.label, timestamp: entity.data.timestamp}});
        }

        newState = EditorState.push(newState, newContent, 'insert-characters');
        sel = newState.getSelection();
        setTimeout(()=>{
            setEditorState(EditorState.forceSelection(newState, sel));
        }, 200);
    }, [editorState])

    const handleStatusEntity = useCallback((entity: any)=>{
        if (!entity){
            return;
        }
        let sel = editorState.getSelection();
        let newContent: ContentState;
        let newState = editorState;

        if (entity.mode === 'edit' && entity.entityKey){
            newContent = editEntity(entity);
            setStatusPopup({show: false});
        }
        else if (entity.mode === 'delete' && entity.entityKey){
            newContent = removeEntity(entity);
            setStatusPopup({show: false});
        }
        else{
            entity= {
                ...entity, 
                type: 'STATUS',
                mutability: 'IMMUTABLE', 
                data:{ 
                    label: 'STATUS'
                }
            };
            const createResp = createEntity(entity);
            newContent = createResp.contentState;
            setStatusPopup({show: true, options: {mode: 'edit', entityKey: createResp.entityKey, label: entity.data.label, color: entity.data.color}});
        }

        newState = EditorState.push(newState, newContent, 'insert-characters');
        sel = newState.getSelection();
        setTimeout(()=>{
            setEditorState(EditorState.forceSelection(newState, sel));
        }, 200);
    }, [editorState])

    const handleAttachment = useCallback((entity: any)=>{
        let newEditorState = editorState;
        let sel = editorState.getSelection();
        let contentState = editorState.getCurrentContent();
        const contentBlock = contentState.getBlockForKey(sel.getAnchorKey());
        // if (!isEmpty(contentBlock.getText())){
        // }else{
        //     newEditorState = RichUtils.toggleBlockType(addEmptyBlockAtEnd(newEditorState), 'attachment')
        // }
        newEditorState = addEmptyBlockAtSelection(addEmptyBlockAtEnd(newEditorState), 'attachment');
        
        sel = newEditorState.getSelection();
        contentState =  Modifier.setBlockData(newEditorState.getCurrentContent(), sel, entity.data);
        setEditorState(EditorState.push(newEditorState, contentState, 'change-block-data'));
        // contentRef.current?.focus();
        // EditorState.push(newEditorState, contentState, 'insert-characters')
    }, [editorState])

    const handleNewState = useCallback((newState: EditorState) =>{
        const sel = newState.getSelection();
        if (window.getSelection()){
            setLastSelection(window.getSelection());
        }
        // inline text format
        setCurrentStyles(newState.getCurrentInlineStyle().toArray());

        // block list styling
        const blockType = newState.getCurrentContent().getBlockForKey(sel.getAnchorKey()).getType();
        setCurrentBlockType(textblockStyles.find(item => item.value == blockType) || listStyles.find(item => item.value == blockType));

        // inline color styling
        const textColor = newState.getCurrentInlineStyle().toArray().find(color => color.startsWith('TEXT_'));
        setCurrentTextColor(textColorStyles.find(color => color.style === textColor));

        // handle @mention popup
        const blockText = newState.getCurrentContent().getBlockForKey(sel.getStartKey()).getText()
        const beforeSelectionText = blockText.slice(0, sel.getStartOffset()) ;
        const words = beforeSelectionText.split(" ");
        const lastWord = words[words.length-1]
        const afterSelectionChar = blockText[sel.getStartOffset()];
        const beforeSelectionChar = beforeSelectionText[beforeSelectionText.length -1];
        if (beforeSelectionChar !== " "
            && lastWord.startsWith('@')
            && (isEmpty(afterSelectionChar) || afterSelectionChar == " ")
        ){
            setMentionPopup({show: true, position: getPopupPosition(), searchText: lastWord.slice(1, lastWord.length-1)});
        }
        else {
            setMentionPopup({show: false, position: [0, 0], searchText: ''});
        }
    }, [])

    useEffect(() => {
        handleNewState(editorState);
    }, [editorState])

    useEffect(()=>{
        // each value is tagged with its ID, same ID signifies the fact that the change will be uppended and "selectionState" will be maintained. Changing id means the entire content will renewed to given value and selection will be lost (or not set properly).
        if (props.value?.state && (!prevVal || !prevVal.state || prevVal.id !== props.value.id)){
            setEditorState(
                EditorState.moveFocusToEnd(
                    EditorState.createWithContent(convertFromRaw(props.value? JSON.parse(props.value.state): {blocks: [], entityMap: {}}), decorator)
                )
            );
        }
        setPrevVal(props.value);
    }, [props.value])
    
    return (
        <TextEditorContext.Provider value={{containerWidth, linkPopup, setLinkPopup, handleLinkEntity, datePopup, setDatePopup, handleDateEntity, statusPopup, setStatusPopup, editorState}}>
            <div>
               { 
                    !active &&
                    <div className={`${props.bannerClassName?? 'rounded border text-muted p-2 bg-smoke-hover'}`}
                        onClick={()=>{
                            setActive(true);
                            (props.onToggle||(()=>{}))(true);
                            // containerRef.current?.focus();
                            // contentRef.current?.focus();
                            setEditorState(EditorState.moveFocusToEnd(editorState));
                        }}
                    >
                        {
                            <Editor
                                editorState={editorState}
                                onChange={(newState)=>{}}
                                customStyleMap={{...textColorMap}}
                                placeholder={props.placeholder??'Help others understand about this isse.'}
                                blockStyleFn={myBlockStyleFn}
                                blockRendererFn={myBlockRenderer}
                                readOnly
                            />
                        }
                    </div>
                }
                {
                    // active &&
                    <div ref={onContainerObserve} hidden={!active}>
                        <div ref={containerRef} className='border rounded'>
                            <div className='p-2 border-bottom d-flex flex-nowrap' style={{userSelect: 'none'}}>
                                <div className='' title='Text Styles'>
                                    <DropdownAction 
                                        actionCategory={[
                                            {
                                                label: 'Text Styles',
                                                value: 'text-styles',
                                                items: textblockStyles,
                                                selectedItems: currentBlockType? [currentBlockType]: []
                                            }
                                        ]}
                                        bsIcon={'caret-down'}
                                        buttonText={(currentBlockType && currentBlockType.category === 'text') ? currentBlockType.label: 'Normal'}
                                        extraClasses='toggle-md'
                                        dropdownClass='start-0'
                                        buttonClass='p-1 px-2 btn-as-bg'
                                        disabled={currentBlockType?.category === 'list'}
                                        handleItemClick={(event)=> handleBlockToggle(event.item as BlockType)} 
                                    />
                                </div>
                                {VerticalBreak}
                                <div className=''>
                                    <TextFormats 
                                        formatList={formatList}
                                        currentStyles={currentStyles}
                                        onToggle={handleFormatToggle}
                                    />
                                </div>
                                {VerticalBreak}
                                <div className=''>
                                    <TextColors 
                                        textColorList={textColorStyles} 
                                        selectedColor={currentTextColor || textColorStyles[0]}
                                        onChange={handleTextColorToggle}
                                    />
                                </div>
                                {VerticalBreak}
                                <div className=''>
                                    <ListStyles 
                                        styleList={listStyles} 
                                        selectedStyle={(currentBlockType || textblockStyles[0]) as ListStyle}
                                        onChange={handleBlockToggle}
                                    />
                                </div>
                                {VerticalBreak}
                                <div ref={entityRef} className=''>
                                    <Entities 
                                        linkPopup={linkPopup.show} 
                                        onSelect={handleEntityToggle} 
                                        onEmojiInput={handleEmojiEntity}                        
                                    />
                                </div>
                                {VerticalBreak}
                            </div>
                            <div id="editor" className='p-5 editor-container' onClick={() => {contentRef.current?.focus();}}>
                                <Editor
                                    ref={contentRef}
                                    editorState={editorState}
                                    onChange={(newState)=>{
                                        if (props.onChange){
                                            props.onChange({open: active, value: JSON.stringify(convertToRaw(newState.getCurrentContent()))});
                                        }
                                        // else{
                                        //     setEditorState(newState);
                                        // }
                                        setEditorState(newState);
                                    }}
                                    customStyleMap={{...textColorMap}}
                                    blockStyleFn={myBlockStyleFn}
                                    blockRendererFn={myBlockRenderer}
                                    keyBindingFn={myKeyBindingFn}
                                    handleKeyCommand={handleKeyCommand}
                                    placeholder={'Write a description for for this issue...'}
                                />
                            </div>
                            {
                                mentionPopup.show &&
                                <div 
                                    className='position-absolute' 
                                    style={{top: mentionPopup.position[0], left: mentionPopup.position[1], zIndex: 101}}
                                >
                                        <Mention 
                                            onSelect={handleMentionEntity}
                                            searchText={mentionPopup.searchText}
                                        />
                                </div>
                            }
                            {
                                linkPopup.show && 
                                <div
                                    ref={linkPopupRef}
                                    className='position-absolute' 
                                    style={{top: popupPosition[0], left: popupPosition[1], zIndex: 100}}
                                >
                                    <Link 
                                        onInput={handleLinkEntity}
                                        options={linkPopup.options}
                                    />
                                </div>
                            }
                            {
                                datePopup.show && 
                                <div
                                    ref={datePopupRef}
                                    className='position-absolute' 
                                    style={{top: popupPosition[0], left: popupPosition[1], zIndex: 100}}
                                >
                                    <DatePicker 
                                        onInput={handleDateEntity}
                                        options={datePopup.options}
                                    />
                                </div>
                            }
                            {
                                statusPopup.show && 
                                <div
                                    ref={statusPopRef}
                                    className='position-absolute' 
                                    style={{top: popupPosition[0], left: popupPosition[1], zIndex: 100}}
                                >
                                    <Status 
                                        onInput={handleStatusEntity}
                                        options={statusPopup.options}
                                    />
                                </div>
                            }
                            <AttachmentEntity 
                                show={attachmentModal.show}
                                onInput={handleAttachment}
                                onToggle={(value)=> setAttachmentModal({show: value})}
                            />
                        </div>
                        <div className='d-flex flex-nowrap mt-2'>
                            {
                                props.onSave &&
                                <div  className='me-2'>
                                    <Button 
                                        label={'Save'} 
                                        extraClasses="btn-as-thm p-1 px-2"
                                        handleClick={()=>{
                                            (props.onSave || (()=>{}))(JSON.stringify(convertToRaw(editorState.getCurrentContent())));
                                            setActive(false);
                                            (props.onToggle||(()=>{}))(false);
                                            // setEditorState(EditorState.createEmpty(decorator));
                                            // EditorState.create
                                        }}
                                    />
                                </div>
                            }
                            {
                                props.onToggle &&
                                <div>
                                    <Button 
                                        label={'Cancel'} 
                                        extraClasses="btn-as-light p-1 px-2"
                                        handleClick={()=>{
                                            setActive(false);
                                            (props.onToggle||(()=>{}))(false);
                                        }}
                                    />
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>
        </TextEditorContext.Provider>
    )
}

const MentionSpan: FC<any> = (props)=>{
    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey);
    const entityData = entity.getData();
    
    return (
        <span unselectable='on' className='bg-grey1 rounded-pill px-1'>
            {props.children}
        </span>
    )
}

const InfoBlock: FC<any> = (props) => {
    return (
        <div className='info-block d-flex'>
            <div className='me-2' contentEditable='false' suppressContentEditableWarning>
                <i className='bi bi-info-circle'></i>
            </div>
            <div className=''
                style={{width: 'calc(100% - 2em)'}}
            >
                <EditorBlock {...props}>
                    {/* <i className='bi bi-info-circle'></i> */}
                </EditorBlock>
            </div>
        </div>
    )
}

const BlockQuote: FC<any> = (props) => {
    return (
        <div className='custom-blockquote d-flex'>
            <div className='me-2 bg-grey1' contentEditable='false' suppressContentEditableWarning
                style={{width: '4px'}}
            ></div>
            <div className='w-100 py-2'>
                <EditorBlock {...props}>
                    {/* <i className='bi bi-info-circle'></i> */}
                </EditorBlock>
            </div>
        </div>
    )
}

const AttachemntBlock: FC<any> = (props) => {
    const editRef = useRef<HTMLDivElement>();
    // const { editorState } = useContext(TextEditorContext);
    // const active = useMemo(()=>{
    //     if (!editorState) return;
    //     const sel = editorState.getSelection();
    //     const contentBlock = editorState.getCurrentContent().getBlockForKey(sel.getAnchorKey());
    //     console.log(contentBlock.getEntityAt(0));
    //     return contentBlock.getKey() === props.block.getKey();
    // }, [editorState])
    // const entity = props.block.getEntityAt(0);
    // ${active? 'border-primary': ''}
    const data = useMemo(()=> (props.block as ContentBlock).getData(), [props]);
    return (
        <div className={`rounded attachment d-flex border `}
        >
            <div className='me-2' contentEditable='false' suppressContentEditableWarning>
                <AttachCard 
                    path={data.get('path')} 
                    updatedAt={data.get('updatedAt')} 
                    updatedBy={""} 
                    name={data.get('name')} 
                    type={data.get('type')}
                    loading={data.get('loading')}
                    progress={data.get('progress')}
                    size={data.get('size')}
                    onAction={()=>{}}
                />
            </div>
            
            <div className=''
                style={{width: 'calc(100% - 14em)'}}
            >
                <EditorBlock ref={editRef} {...props}>
                    
                </EditorBlock>
            </div>
        </div>
    )
}

function getInsertStrategy(type: 'MENTION' | 'LINK' | 'DATE' | 'STATUS'){
    return (contentBlock: ContentBlock, callback: (start: number, end: number)=> void, contentState: ContentState) => {
        contentBlock.findEntityRanges(
            (character) => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === type
                );
            },
            callback
        );
    }
}

function findMentionEntity(contentBlock: ContentBlock, callback: (start: number, end: number)=> void, contentState: ContentState){
    contentBlock.findEntityRanges(
        (character) => {
            const entityKey = character.getEntity();
            return (
                entityKey !== null &&
                contentState.getEntity(entityKey).getType() === "MENTION"
            );
        },
        callback
    );
}

function myBlockStyleFn(contentBlock: ContentBlock) {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return 'code-block';
    }
    // else if(type === 'info-block'){
    //     return 'info-block'
    // }
    return ''
}

function addEmptyBlockAtEnd(editorState: EditorState): EditorState {
    let contentState =  editorState.getCurrentContent();
    let sel = editorState.getSelection();

    const newBlock = new ContentBlock({
        key: uniqueId(),
        type: 'unstyled',
        text: '',
        characterList: List()
    });
    
    const newBlockMap = contentState.getBlockMap().set(newBlock.getKey(), newBlock)

    let newState = EditorState.push(
        editorState,
        ContentState.createFromBlockArray(newBlockMap.toArray()),
        'split-block'
    );
    return EditorState.forceSelection(newState, sel);
}

function addEmptyBlockAtSelection(editorState: EditorState, blockType?: string): EditorState {
    let contentState =  editorState.getCurrentContent();
    let sel = editorState.getSelection();

    const newBlock = new ContentBlock({
        key: uniqueId(),
        type: blockType || 'unstyled',
        text: '',
        characterList: List()
    });
    
    let blockMap = contentState.getBlockMap();
    const newBlockMap = OrderedMap<string, ContentBlock>().withMutations(map => {
        blockMap.forEach((v, k)=>{
            if (!k || !v) return;
            map.set(k, v);
    
            if (sel.getAnchorKey() === k) {
              map.set(newBlock.getKey(), newBlock);
            }
        })
    });

    let blockArray: ContentBlock[] = [];
    const iter = newBlockMap.values();
    let nextVal = iter.next();
    do{
        blockArray.push(nextVal.value);
        nextVal = iter.next();
    }while(!nextVal.done);
    
    return EditorState.forceSelection(
        EditorState.push(
            editorState,
            ContentState
                .createFromBlockArray(blockArray)
                .set('selectionBefore', contentState.getSelectionBefore())
                .set('selectionAfter', contentState.getSelectionAfter()) as ContentState,
            'insert-fragment'
        ),
        SelectionState.createEmpty(newBlock.getKey())
    )
}

function myBlockRenderer(contentBlock: ContentBlock) {
    const type = contentBlock.getType();
    
    if (type === 'info-block') {
      return {
        component: InfoBlock,
        editable: true,
        props: {
            text: contentBlock.getText(),
        },
      };
    }else if(type === 'custom-blockquote'){
        return {
            component: BlockQuote,
            editable: true,
            props: {
                text: contentBlock.getText(),
            },
        };
    }else if(type === 'attachment'){
        return {
            component: AttachemntBlock,
            editable: true,
            props: {
                text: contentBlock.getText(),
            },
        };
    }
}

const {hasCommandModifier} = KeyBindingUtil;
function myKeyBindingFn(e: any): string | null {
//   if (e.keyCode === 13 /* `Enter` key */) {
//     return 'custom-enter';
//   }
  return getDefaultKeyBinding(e);
}

export default TextEditor;