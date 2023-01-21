import { ContentState } from 'draft-js';
import { FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../Button/Button';
import { VerticalBreak } from '../../../../../VerticalBreak/VerticalBreak';
import { TextEditorContext } from '../../../TextEditor';
import Link from '../Link';
import './LinkSpan.css';

interface LinkSpanProps{

}

const LinkSpan: FC<any> = (props) => {
    const { setLinkPopup, handleLinkEntity } = useContext(TextEditorContext);
    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey)
    const entityData = entity.getData();
    const [drop, setDrop] = useState(false);
    const navigate = useNavigate();
    
    const toggleRef = useRef<HTMLDivElement>(null);
    const linkViewRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const handleClick = useCallback((event: any) =>{
        if (toggleRef.current && toggleRef.current.contains(event.target)){
            setDrop(true);
        }
        else if (dropdownRef.current?.contains(event.target) || linkViewRef.current?.contains(event.target)){

        }
        else{
            setDrop(false);
        }
    }, [drop]);
    
    useEffect(()=>{
        document.addEventListener('click', handleClick, true);
        return () => {document.removeEventListener('click', handleClick, true)};
    },[]);
    
    return (
        <div className='dropdown d-inline-block'>
            <div ref={toggleRef} unselectable='on' className='rounded border shadow-sm px-1 cursor-pointer  bg-white'
            >
                {/* <span className='text-cut' style={{width: 0, height: 0}}>
                    
                </span> */}
                <i className='bi bi-link-45deg text-primary'></i>
                <a href={entityData.url.startsWith('http')? entityData.url: `https://${entityData.url}`} className='ms-1 no-decor text-primary underline-hover' role='button'>{props.children}</a>
            </div>
            <div ref={dropdownRef} className={`dropdown-menu p-1 rounded shadow-sm border f-90 bg-white ${drop? 'show': ''}`} style={{left: '-50%', zIndex: 100}} contentEditable='false' suppressContentEditableWarning={true}>
            <div className='d-flex'>
                <div>
                    <Button 
                        label='Edit link'
                        extraClasses='btn-as-bg p-1'
                        handleClick={() =>{
                            setDrop(false);
                            setTimeout(()=>{
                                setLinkPopup({
                                    show: true, 
                                    options: {
                                        mode: 'edit', 
                                        entityKey: props.entityKey, 
                                        url: entityData.url, 
                                        label: entityData.label
                                    }
                                });
                            }, 100)
                        }}
                    />
                </div>
                {VerticalBreak}
                <div>
                    <Button 
                        label='Redirect'
                        hideLabel
                        leftBsIcon='box-arrow-up-right'
                        extraClasses='btn-as-bg p-1 px-2'
                        handleClick={() =>{
                            setDrop(true);
                            window.open(entityData.url.startsWith('http')? entityData.url: `https://${entityData.url}`);
                        }}
                    />
                </div>
                {VerticalBreak}
                <div>
                    <Button 
                        label='Redirect'
                        hideLabel
                        leftBsIcon='trash3'
                        extraClasses='btn-as-bg p-1 px-2'
                        handleClick={() =>{
                            handleLinkEntity({
                                mode: 'delete',
                                entityKey: props.entityKey
                            })
                        }}
                    />
                </div>
            </div>
            </div>
        </div>
        
    )
}

export default LinkSpan;