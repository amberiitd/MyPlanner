import { FC } from "react";

const CircleRotate: FC<{loading: boolean; onReload?: ()=> void;}> = (props) => {
    return (
        <div className="">
            {
                props.loading &&
                <div className="spinner-border text-muted" role="status">
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