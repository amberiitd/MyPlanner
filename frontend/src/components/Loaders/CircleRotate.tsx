import { FC } from "react";
import './CircleRotate.css'
const CircleRotate: FC<{loading: boolean; onReload?: ()=> void; size?: string}> = (props) => {
    return (
        <div className="">
            {
                props.loading &&
                <div className={`spinner-${props.size || 'md'} spinner-border text-muted`} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            }
            {
                !props.loading && props.onReload && 
                <button className="btn btn-sm btn-outline-secondary" onClick={(e) => { 
                    (props.onReload || (()=>{}))(); 
                }}>
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            }
        </div>
    )
}

export default CircleRotate;