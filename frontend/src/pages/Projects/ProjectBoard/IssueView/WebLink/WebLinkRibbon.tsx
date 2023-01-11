import { FC, useContext, useState } from "react";
import Button from "../../../../../components/Button/Button";
import NumberBadge from "../../../../../components/NumberBadge/NumberBadge";
import { issueTypeMap } from "../../Backlog/IssueCreator/IssueTypeSelector/issueTypes";
import { ProjectBoardContext } from "../../ProjectBoard";
import { SimpleWebLink } from "./WebLinkCreator";

const WebLinkRibbon: FC<{link: SimpleWebLink; onRemove: ()=> void;}> = (props) => {
    const [hovered, setHovered] = useState(false);
    const {openProject} = useContext(ProjectBoardContext);
    return (
        <div className='d-flex flex-nowrap align-items-center border rounded bg-white w-100 p-2 ribbon'
            onMouseEnter={()=>{setHovered(true)}}
            onMouseLeave={()=>{setHovered(false)}}
        >
            <div className='mx-1'>
                <i className={`bi bi-link-45deg`}></i>
            </div>
            <a className='mx-1 text-cut no-decor underline-hover' href={props.link.href}>
                {props.link.label}
            </a>
            <div className="ms-auto" style={{opacity: (!hovered) ? 0: 1}}>
                <Button 
                    label="Cancel"
                    hideLabel={true}
                    rightBsIcon="x-lg"
                    extraClasses="btn-as-light ps-1"
                    handleClick={props.onRemove}
                />
            </div>
        </div>
    )
}

export default WebLinkRibbon;

