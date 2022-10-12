import { relative } from 'path';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import './WindowSlider.css';

interface WindowSliderProps{
    dragStartCallBack: (e: any) => void;
    children: any;
}

const WindowSlider: FC<WindowSliderProps> = (props) => {
    const ref = useRef<HTMLDivElement>(null);
    const dragRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({x: 0, y: 0});
    const [diffPosition, setDiffPosition] = useState({dx: 0, dy: 0});
    const [lastPosition, setLastPosition] = useState({x: 10, y: 10});
    const handleDragStart = useCallback((e: any)=>{
        props.dragStartCallBack(e);
        setLastPosition({
            x: position.x,
            y: position.y
        })
        setDiffPosition({
            dx: e.clientX - (ref.current? ref.current.offsetLeft: 0) - position.x,
            dy: e.clientY - (ref.current? ref.current.offsetTop: 0) - position.y,
        })
        
        
        // const img = document.createElement("div");
        // img.id = 'drag-img'
        // img.style.opacity = "1";
        // document.body.appendChild(img);
        // e.dataTransfer.setDragImage(img, 0, 0);
    }, [ref, position])

    const handleDrag = useCallback((e: any) =>{
        setPosition({
            x: e.clientX - diffPosition.dx -(ref.current? ref.current.offsetLeft: 0),
            y: e.clientY - diffPosition.dy -(ref.current? ref.current.offsetTop: 0)
        })
    }, [diffPosition, ref])
    const handleDragEnd = useCallback((e: any) => {
        var img = document.getElementById("drag-img");
        if (img?.parentNode) {
            img.parentNode.removeChild(img);
        }

        const newx = e.clientX - diffPosition.dx -(ref.current? ref.current.offsetLeft: 0);
        const newy = e.clientY - diffPosition.dy -(ref.current? ref.current.offsetTop: 0);
        if (ref.current && dragRef.current){
            const parent = ref.current?.getBoundingClientRect();
            const elem = dragRef.current?.getBoundingClientRect()
            if (parent.bottom > elem.bottom && elem.top > parent.top 
                && parent.left < elem.left && elem.right < parent.right
            ){
                setPosition({
                    x: newx,
                    y: newy
                })
                return;
            }
        }
        // setPosition({...lastPosition})
        
    }, [diffPosition, ref, dragRef, lastPosition])

    useEffect(() => {
        setPosition({
            x: 0,
            y: 0
        })
    }, [props])

    return (
        <div  ref={ref} className='p-1 border' 
            style={{position: 'relative'}} 
            onDragOver = {(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
            onDragEnd ={handleDragEnd}
            onDrag={handleDrag}
        >
            <div
                ref={dragRef}
                className='border p-1' 
                onMouseDown={(e) => {}} 
                draggable={true}
                onDragStart={handleDragStart}
                style={{
                    position: 'absolute',
                    top: position.y,
                    left: position.x,
                    cursor: 'ns-resize',
                }}
            >
                {props.children}
            </div>
        </div>
    )
}

export default WindowSlider;