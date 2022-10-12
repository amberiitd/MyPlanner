import { ContentBlock, Editor, EditorState, RichUtils } from 'draft-js';
import { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { SimpleAction } from '../../../model/types';
import DropdownAction from '../../DropdownAction/DropdownAction';
import './TextEditor.css';
import TextFormats, { Format } from './TextFormats/TextFormats';
import Immutable from 'immutable';
import TextColors, { TextColor } from './TextColors/TextColors';
import ListStyles, { ListStyle } from './ListStyles/ListStyles';
import { Provider } from 'react-redux';
import { ProjectBoardContext } from '../../../pages/Projects/ProjectBoard/ProjectBoard';
import { IssueViewContext } from '../../../pages/Projects/ProjectBoard/IssueView/IssueView';

interface TextEditorProps{

}

export interface BlockType extends SimpleAction {
    category: 'text' | 'list';
}

export const TextEditorContext = createContext<{
    containerWidth: number | undefined;
}>({containerWidth: undefined});

const TextEditor: FC<TextEditorProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState<number | undefined>();
    const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
    const [currentStyles, setCurrentStyles] = useState<string[]>([]);
    const [currentBlockType, setCurrentBlockType] = useState<BlockType | undefined>();
    const [currentTextColor, setCurrentTextColor] = useState<TextColor | undefined>();

    const boardSizes = useContext(ProjectBoardContext).windowSizes;
    const innerPanelSizes = useContext(IssueViewContext).windowSizes;

    const handleResize = useCallback(() => {
        if (
            containerRef && containerRef.current 
        ){
            setContainerWidth(containerRef.current.clientWidth);
        }
    }, [containerRef]); 

    useEffect(() => {
        handleResize();
    }, [boardSizes, innerPanelSizes]);

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {window.removeEventListener('resize', handleResize)}
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

    const handleFormatToggle = (format: Format) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, format.style));
    }

    const handleBlockToggle = (block: BlockType) => {
        if (block.value === currentBlockType?.value){
            setEditorState(RichUtils.toggleBlockType(editorState, textblockStyles[0].value));
        }
        else{
            setEditorState(RichUtils.toggleBlockType(editorState, block.value)); 
        }
    }

    const handleTextColorToggle = (color: TextColor) => {
        if (currentTextColor && currentTextColor.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, currentTextColor.style));
        }

        if (color.style !== 'TEXT_NORMAL'){
            setEditorState(RichUtils.toggleInlineStyle(editorState, color.style));
        }
    }

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
        setCurrentStyles(editorState.getCurrentInlineStyle().toArray());

        const blockType = editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getAnchorKey()).getType();
        setCurrentBlockType(textblockStyles.find(item => item.value == blockType) || listStyles.find(item => item.value == blockType));

        const textColor = editorState.getCurrentInlineStyle().toArray().find(color => color.startsWith('TEXT_'));
        setCurrentTextColor(textColorStyles.find(color => color.style === textColor));
    }, [editorState])
    
    return (
        <TextEditorContext.Provider value={{containerWidth}}>
            <div ref={containerRef} className='border rounded'>
                <div className='p-2 border border-bottom d-flex flex-nowrap' style={{userSelect: 'none'}}>
                    <div className='border-end'>
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
                </div>
                <div id="editor" className='p-5 editor-container' onClick={() => {contentRef.current?.focus()}}>
                    <Editor
                        ref={contentRef}
                        editorState={editorState}
                        onChange={setEditorState}
                        customStyleMap={{...textColorMap}}
                        placeholder={'Write a description for for this issue...'}
                    />
                </div>
                
            </div>
        </TextEditorContext.Provider>
    )
}

export default TextEditor;