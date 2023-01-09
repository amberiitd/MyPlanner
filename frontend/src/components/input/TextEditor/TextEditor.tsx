import { CompositeDecorator, ContentBlock, ContentState, Editor, EditorState, Modifier, RichUtils, convertFromRaw, convertToRaw } from 'draft-js';
import React, { createContext, FC, useCallback, useEffect, useRef, useState } from 'react';
import { SimpleAction } from '../../../model/types';
import DropdownAction from '../../DropdownAction/DropdownAction';
import './TextEditor.css';
import TextFormats, { Format } from './TextFormats/TextFormats';
import TextColors, { TextColor } from './TextColors/TextColors';
import ListStyles, { ListStyle } from './ListStyles/ListStyles';
import { isEmpty, max } from 'lodash';
import Mention from './Entities/Mention/Mention';
import Entities, { Insert } from './Entities/Entities';
import Link from './Entities/Link/Link';
import LinkSpan from './Entities/Link/LinkSpan/LinkSpan';
import Button from '../../Button/Button';

interface TextEditorProps{
    bannerClassName?: string;
    placeholder?: string;
    open?: boolean;
    value?: string;
    onToggle?: (open: boolean) => void;
    onSave?: (state: string) => void;
}

export interface BlockType extends SimpleAction {
    category: 'text' | 'list';
}

export const TextEditorContext = createContext<{
    containerWidth: number | undefined;
}>({containerWidth: undefined});

const TextEditor: FC<TextEditorProps> = (props) => {
    const observer = useRef<any>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(!!props.open);
    const linkPopupRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | undefined>();
    const [mentionPopup, setMentionPopup] = useState({show: false, position: [0, 0]});
    const [linkPopup, setLinkPopup] = useState({show: false, position: [0, 0]});
    const [lastSelection, setLastSelection] = useState<Selection | null>();

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
    const state = EditorState.createWithContent(convertFromRaw(props.value? JSON.parse(props.value): {blocks: [], entityMap: {}}), decorator);

    const [editorState, setEditorState] = useState<EditorState>(state);
    
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

    useEffect(()=>{
        const state = EditorState.createWithContent(convertFromRaw(props.value? JSON.parse(props.value): {blocks: [], entityMap: {}}), decorator);
        setEditorState(state);
    }, [props.value])

    useEffect(() => {
        const handleClick = (e: any)=>{
            if (linkPopupRef.current && linkPopupRef.current.contains(e.target)){

            }
            else if (e.target.parentNode?.id === 'editor-link-toggler'){
                // setLinkPopup({show: !linkPopup.show, position: [0, 0]})
            }
            else{
                setLinkPopup({show: false, position: [0, 0]})
            }
        };

        window.addEventListener('click', handleClick)
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])

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
        }
    ];

    // const blockRenderMap = Immutable.Map({
    //     'header-one': {
    //         element: 'h1'
    //     },
    //     'header-two': {
    //         element: 'h2'
    //     },
    //     'unstyled': {
    //         element: 'p'
    //     }
    // });
    const contentRef = useRef<Editor>(null);

    const handleFormatToggle = useCallback((format: Format) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, format.style));
    }, [editorState])

    const handleBlockToggle = useCallback((block: BlockType) => {
        if (block.value === currentBlockType?.value){
            setEditorState(RichUtils.toggleBlockType(editorState, textblockStyles[0].value));
        }
        else{
            setEditorState(RichUtils.toggleBlockType(editorState, block.value)); 
        }
    }, [editorState])

    const handleTextColorToggle = useCallback((color: TextColor) => {
        if (currentTextColor && currentTextColor.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, currentTextColor.style));
        }

        if (color.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, color.style));
        }
    }, [editorState]);

    const getPopupPosition =  useCallback(() => {
        containerRef.current?.focus();
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
        containerRef.current?.focus();
        return position;
    }, [containerRef, lastSelection]);

    const handleEntityToggle = useCallback((insert: Insert)=>{
        switch(insert.value){
            case 'link':
                setLinkPopup({show: true, position: getPopupPosition()});
                break;
        }
    }, [editorState])

    // TO DO: use draft-js-plugin/mention instead 
    const handleMentionEntity = useCallback((entity: any) => {
        if (!entity){
            setMentionPopup({show: false, position: [0, 0]})
            return;
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const sel = editorState.getSelection();
        // const contentStateWithLink = Modifier.applyEntity(
        //     contentStateWithEntity,
        //     editorState.getSelection(),
        //     entityKey,
        // );
        const blockText = contentState.getBlockForKey(sel.getStartKey()).getText();
        const beforeSelectionText = blockText.slice(0, sel.getStartOffset()) ;
        const words = beforeSelectionText.split(" ");
        const lastWord = words[words.length-1]
        let newSelection = sel.merge({
            anchorOffset: sel.getStartOffset() -lastWord.length,
            focusOffset: sel.getStartOffset()
        });

        let newContent = Modifier.replaceText(contentState, newSelection, entity.data.label, undefined, entityKey);
        let newState = EditorState.push(editorState, newContent, 'insert-characters');

        newSelection = newState.getSelection();
        newContent = Modifier.insertText(newState.getCurrentContent(), newSelection, " ");
 
        // const newEditorState = EditorState.set(editorState, {
        //     currentContent: contentStateWithLink,
        // });
        setEditorState(EditorState.push(newState, newContent, 'insert-characters'));
        setMentionPopup({show: false, position: [0, 0]})
    }, [editorState])

    const handleLinkEntity = useCallback((entity: any) => {
        if (!entity){
            setLinkPopup({show: false, position: [0, 0]})
            return;
        }
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(entity.type, entity.mutability, entity.data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const sel = editorState.getSelection();

        let newContent = Modifier.insertText(contentState, sel, entity.data.label || entity.data.url, undefined, entityKey);
        setEditorState(EditorState.push(editorState, newContent, 'insert-characters'));
        setLinkPopup({show: false, position: [0, 0]})
    }, [editorState])

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

    const textColorMap = {
        'TEXT_RED': {
            color: 'red'
        },
        'TEXT_ORANGE': {
            color: 'orange'
        }
    }

    // const myBlockStyleFn= (contentBlock: ContentBlock) => {
    //     const type = contentBlock.getType();
    //     if (type === 'blockquote') {
    //         return 'superFancyBlockquote';
    //     }
    //     editorState.
    // }

    useEffect(() => {
        const sel = editorState.getSelection();
        if (window.getSelection()){
            setLastSelection(window.getSelection());
        }
        // inline text format
        setCurrentStyles(editorState.getCurrentInlineStyle().toArray());

        // block list styling
        const blockType = editorState.getCurrentContent().getBlockForKey(sel.getAnchorKey()).getType();
        setCurrentBlockType(textblockStyles.find(item => item.value == blockType) || listStyles.find(item => item.value == blockType));

        // inline color styling
        const textColor = editorState.getCurrentInlineStyle().toArray().find(color => color.startsWith('TEXT_'));
        setCurrentTextColor(textColorStyles.find(color => color.style === textColor));

        // handle @mention popup
        const blockText = editorState.getCurrentContent().getBlockForKey(sel.getStartKey()).getText()
        const beforeSelectionText = blockText.slice(0, sel.getStartOffset()) ;
        const words = beforeSelectionText.split(" ");
        const lastWord = words[words.length-1]
        const afterSelectionChar = blockText[sel.getStartOffset()];
        const beforeSelectionChar = beforeSelectionText[beforeSelectionText.length -1];
        if (beforeSelectionChar !== " "
            && lastWord.startsWith('@')
            && (isEmpty(afterSelectionChar) || afterSelectionChar == " ")
        ){
            if (!mentionPopup.show){
                
                setMentionPopup({show: true, position: getPopupPosition()});
            }
        }
        else {
            setMentionPopup({show: false, position: [0, 0]});
        }
        
    }, [editorState])
    
    return (
        <TextEditorContext.Provider value={{containerWidth}}>
            <div>
               { 
                    !active &&
                    <div className={`${props.bannerClassName?? 'rounded border text-muted p-2 bg-light'}`}
                        onClick={()=>{
                            setActive(()=>{
                                (props.onToggle||(()=>{}))(true);
                                return true;
                            });
                            containerRef.current?.focus();
                        }}
                    >
                        {/* <input className='p-2 w-100' type='text' disabled={true} placeholder={props.placeholder??'Help others understand about this isse.'}/> */}
                        {
                            <Editor
                                editorState={editorState}
                                onChange={(newState)=>{}}
                                customStyleMap={{...textColorMap}}
                                placeholder={props.placeholder??'Help others understand about this isse.'}
                                readOnly
                            />
                        }
                    </div>
                }
                {
                    active &&
                    <div ref={onContainerObserve}>
                        <div ref={containerRef} className='border rounded'>
                            <div className='p-2 border-bottom d-flex flex-nowrap' style={{userSelect: 'none'}}>
                                <div className='border-end' title='Text Styles'>
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
                                        extraClasses='toggle-md mx-2'
                                        dropdownClass='start-0'
                                        disabled={currentBlockType?.category === 'list'}
                                        handleItemClick={(event)=> handleBlockToggle(event.item as BlockType)} 
                                    />
                                </div>
                                <div className='border-end'>
                                    <TextFormats 
                                        formatList={formatList}
                                        currentStyles={currentStyles}
                                        onToggle={handleFormatToggle}
                                    />
                                </div>
                                <div className='border-end'>
                                    <TextColors 
                                        textColorList={textColorStyles} 
                                        selectedColor={currentTextColor || textColorStyles[0]}
                                        onChange={handleTextColorToggle}
                                    />
                                </div>
                                <div className='border-end'>
                                    <ListStyles 
                                        styleList={listStyles} 
                                        selectedStyle={(currentBlockType || textblockStyles[0]) as ListStyle}
                                        onChange={handleBlockToggle}
                                    />
                                </div>
                                <div className='border-end'>
                                    <Entities 
                                        linkPopup={linkPopup.show} 
                                        onSelect={handleEntityToggle} 
                                        onEmojiInput={handleEmojiEntity}                        
                                    />
                                </div>
                            </div>
                            <div id="editor" className='p-5 editor-container' onClick={() => {contentRef.current?.focus()}}>
                                <Editor
                                    ref={contentRef}
                                    editorState={editorState}
                                    onChange={(newState)=>{
                                        setEditorState(()=>{
                                            return newState;
                                        })
                                    }}
                                    customStyleMap={{...textColorMap}}
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
                                        />
                                </div>
                            }
                            {
                                linkPopup.show && 
                                <div
                                    ref={linkPopupRef}
                                    className='position-absolute' 
                                    style={{top: linkPopup.position[0], left: linkPopup.position[1], zIndex: 100}}
                                >
                                    <Link 
                                        onInput={handleLinkEntity}
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
                                            setActive(()=>{
                                                (props.onToggle||(()=>{}))(false);
                                                return false;
                                            });
                                            setEditorState(EditorState.createEmpty(decorator));
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
                                            setActive(()=>{
                                                (props.onToggle||(()=>{}))(false);
                                                return false;
                                            });
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
    const entity = contentState.getEntity(props.entityKey)
    return (
        <span {...entity.getData()} unselectable='on' className='rounded-pill bg-primary p-1 text-white'>
            {props.children}
        </span>
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

export default TextEditor;