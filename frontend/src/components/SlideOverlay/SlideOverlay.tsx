import { FC } from "react";
import Button from "../Button/Button";
import './SlideOverlay.css'

interface SlideOverlayProps{
    show?: boolean;
    onToggle: (show: boolean) => void;
    children?: any;
}

const SlideOverlay: FC<SlideOverlayProps> = (props) => {

    return (
        <div className={`slide-overlay border p-1 px-2 shadow-sm rounded position-absolute ${props.show ?'slide-overlay-show': 'slide-overlay-hide'} `}>
            <div className="d-flex mb-2">
                <div className="ms-auto">
                    <Button 
                        label="Cancel"
                        hideLabel={true}
                        leftBsIcon="x-lg"
                        extraClasses="btn-as-bg px-1"
                        handleClick={()=>{props.onToggle(!props.show)}}
                    />
                </div>
                
            </div>
            <div className="d-flex justify-content-center align-items-center border-dash w-100 h-100">
                <div className="p-3 text-muted" hidden={!!props.children}>
                    Add components.
                </div>
                {
                    props.children
                }
            </div>
        </div>
    )
}

export default SlideOverlay;