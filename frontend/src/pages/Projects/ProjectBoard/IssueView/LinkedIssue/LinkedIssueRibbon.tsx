import { FC, useCallback, useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeIssue, updateIssue } from "../../../../../app/slices/issueSlice";
import { RootState } from "../../../../../app/store";
import Button from "../../../../../components/Button/Button";
import NumberBadge from "../../../../../components/NumberBadge/NumberBadge";
import { useQuery } from "../../../../../hooks/useQuery";
import { CrudPayload } from "../../../../../model/types";
import { projectCommonCrud } from "../../../../../services/api";
import { issueTypeMap } from "../../Backlog/IssueCreator/IssueTypeSelector/issueTypes";
import { Issue } from "../../Backlog/IssueRibbon/IssueRibbon";
import { stageMap } from "../../Backlog/IssueRibbon/StageSelector/stages";
import StageSelector from "../../Backlog/IssueRibbon/StageSelector/StageSelector";
import { ProjectBoardContext } from "../../ProjectBoard";

const LinkedIssueRibbon: FC<{issue: Issue; category: string; onRemove: ()=> void;}> = (props) => {
    const [hovered, setHovered] = useState(false);
    const dispatch = useDispatch();
    const {openProject} = useContext(ProjectBoardContext);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    return (
        <div className='d-flex flex-nowrap align-items-center border rounded bg-white w-100 p-2 ribbon'
            onMouseEnter={()=>{setHovered(true)}}
            onMouseLeave={()=>{setHovered(false)}}
        >
            <div className='mx-1'>
                <i className={`bi bi-${issueTypeMap[props.issue.type]?.leftBsIcon}`}></i>
            </div>
            <div className='mx-1 text-cut'>
                {openProject?.key}-{props.issue.id}
            </div>
            <a className='mx-1 cursor-pointer text-cut' href={`issue?issueId=${props.issue.id}`}>
                {props.issue.label}
            </a>

            <div className='ms-auto '>
                <NumberBadge
                    data={props.issue.storyPoint}
                    extraClasses='bg-light'
                    inputClasses='input-sm'
                    onValueChange={(value: number)=>{
                        // projectCommonQuery.trigger({
                        //     action: 'UPDATE',
                        //     data: {projectId: openProject?.id, id: props.issue.id, storyPoint: value},
                        //     itemType: 'issue'
                        // } as CrudPayload)
                        // .then(()=>{
                        //     dispatch(updateIssue({id: props.issue.id, data: { storyPoint: value}}));
                        // })
                    }}
                    disabled
                />
            </div>
            <div style={{opacity: (!hovered) ? 0: 1}}>
                <Button 
                    label="Cancel"
                    hideLabel={true}
                    rightBsIcon="x-lg"
                    extraClasses="btn-as-light ps-1"
                    handleClick={props.onRemove}
                />
            </div>
            {/* <div className=' ms-2'>
                <StageSelector
                    selectedStage={stageMap[props.issue.stage as any]}
                    issueId={props.issue.id}
                />
            </div> */}
            {/* <div>
                <AssigneeSelector
                    assignee={props.issue.assignee}
                    issueId={props.issue.id}
                />
            </div> */}
        </div>
    )
}

export default LinkedIssueRibbon;

