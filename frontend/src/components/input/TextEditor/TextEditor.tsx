import { CompositeDecorator, ContentBlock, ContentState, Editor, EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw, EditorBlock, AtomicBlockUtils, DraftHandleValue, BlockMap, SelectionState } from 'draft-js';
import React, { createContext, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export type LinkPopupOptions = {mode: 'edit' | 'create'; entityKey?: string, url?: string; label?: string; disableLabelEdit?: boolean;};
type LinkPopup = {show: boolean; options?: LinkPopupOptions;};

export const TextEditorContext = createContext<{
    containerWidth: number | undefined;
    linkPopup: LinkPopup;
    setLinkPopup: React.Dispatch<React.SetStateAction<LinkPopup>>;
    handleLinkEntity: (entity: any) => void;
}>({
    containerWidth: undefined,
    linkPopup: {show: false},
    setLinkPopup: ()=>{},
    handleLinkEntity: () =>{}
});

const TextEditor: FC<TextEditorProps> = (props) => {
    const observer = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(!!props.open);
    const linkPopupRef = useRef<HTMLDivElement>(null);
    const entityRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | undefined>();
    const [mentionPopup, setMentionPopup] = useState({show: false, position: [0, 0], searchText: ''});
    const [linkPopup, setLinkPopup] = useState<LinkPopup>({show: false});
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
            if (linkPopupRef.current && (linkPopupRef.current.contains(e.target) || entityRef.current?.contains(e.target))){

            }
            else if (e.target.parentNode?.id === 'editor-link-toggler'){
                // setLinkPopup({show: !linkPopup.show, position: [0, 0]})
            }
            else{
                setLinkPopup({show: false})
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
            if (block.getType() === 'info-block'){
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
        if (block.value === currentBlockType?.value){
            if (block.value === 'info-block'){
                setEditorState(addEmptyBlockAtSelection(editorState));
            }else{
                setEditorState(EditorState.forceSelection(RichUtils.toggleBlockType(editorState, textblockStyles[0].value), sel));
            }
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
        let contentState = editorState.getCurrentContent();
        let sel = editorState.getSelection();
        let newContent: ContentState;
        let newState = editorState;

        if (entity.mode === 'edit' && entity.entityKey){
            newContent = contentState.mergeEntityData(entity.entityKey, {
                ...entity.data
            });

            const contentBlock = contentState.getBlockForKey(sel.getAnchorKey());
            contentBlock.findEntityRanges(
                (character) => {
                    return entity.entityKey === character.getEntity();
                },
                (start: number, end: number) => {
                    const oldLabelSel = sel.merge({
                        anchorOffset: start,
                        focusOffset: end
                    })
                    newContent = Modifier.replaceText(newContent, oldLabelSel, entity.data.label || entity.data.url, undefined, entity.entityKey);
                }
            );
        }
        else if (entity.mode === 'delete' && entity.entityKey){
            newContent = removeEntity(entity);
        }
        else{
            const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            newContent = Modifier.insertText(contentState, sel, entity.data.label || entity.data.url, undefined, entityKey);
            newState = EditorState.push(editorState, newContent, 'insert-characters');
    
            sel = newState.getSelection();
            newContent = Modifier.insertText(newState.getCurrentContent(), sel, " ");
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
        <TextEditorContext.Provider value={{containerWidth, linkPopup, setLinkPopup, handleLinkEntity}}>
            <div>
               { 
                    !active &&
                    <div className={`${props.bannerClassName?? 'rounded border text-muted p-2 bg-light'}`}
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
                                        buttonClass='p-1 btn-as-bg'
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
            <div className='w-100'>
                <EditorBlock {...props}>
                    <i className='bi bi-info-circle'></i>
                </EditorBlock>
            </div>
        </div>
    )
}

function getInsertStrategy(type: 'MENTION' | 'LINK'){
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