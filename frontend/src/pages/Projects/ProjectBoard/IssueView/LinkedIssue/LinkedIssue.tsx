import { label } from "aws-amplify";
import { uniqueId } from "lodash";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { updateIssue } from "../../../../../app/slices/issueSlice";
import { RootState } from "../../../../../app/store";
import Button from "../../../../../components/Button/Button";
import { useQuery } from "../../../../../hooks/useQuery";
import { CrudPayload } from "../../../../../model/types";
import { projectCommonCrud } from "../../../../../services/api";
import { Issue } from "../../Backlog/IssueRibbon/IssueRibbon";
import { ProjectBoardContext } from "../../ProjectBoard";
import { IssueViewContext } from "../IssueView";
import LinkedIssueCreator from "./LinkedIssueCreator";
import LinkedIssueRibbon from "./LinkedIssueRibbon";

interface LinkedIssueProps{
    active?: boolean;
    onToggle?: (active: boolean) => void;
}

const LinkedIssue: FC<LinkedIssueProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const [confirmModal, setConfirmModal] = useState(false);
    const [creator, setCreator] = useState(false);
    const {openIssue} = useContext(IssueViewContext);
    const issues =  useSelector((state: RootState) => state.issues.values);
    const linkedIssues = useMemo(()=> Object.entries(openIssue?.linkedIssues || {}).map(e => ({
        label: e[0],
        issues: issues.filter(issue => e[1].includes(issue.id ))
    })), [openIssue, issues])
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [issueOnStage, setIssueOnStage] = useState<{category: string; issue: Issue} | undefined>(undefined);
    const dispatch = useDispatch();
    
    const handleRemove = useCallback(() =>{
        let linkedIssues = {...(openIssue?.linkedIssues || {})};
        linkedIssues[issueOnStage?.category || 'none'] = (linkedIssues[issueOnStage?.category || 'none'] || []).filter(id => id !== issueOnStage?.issue.id);
        projectCommonQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                id: openIssue?.id,
                linkedIssues
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateIssue({id: openIssue?.id || '', data: {
                linkedIssues
            }}));
            setConfirmModal(false);
        })
    }, [openProject, issueOnStage, openIssue])

    useEffect(()=>{
        setCreator(!!props.active);
    }, [props])
    return (
        <div>
            <div className='d-flex flex-nowrap'>
                <div className='h6'>
                    Linked issues
                </div>
                <div className='ms-auto' >
                    <Button 
                        label='Create'
                        hideLabel={true}
                        rightBsIcon='plus-lg'
                        extraClasses='btn-as-light p-1 ps-2'
                        handleClick={()=>{ 
                            if (props.onToggle) {
                                props.onToggle(true);
                            }
                            else {
                                setCreator(true); 
                            }
                        }}
                    />
                </div>
            </div>
            <div className='mt-2'>
                {
                    linkedIssues.map(cat => (
                        <div key={uniqueId()} className='mb-2'>
                            <div className="text-muted f-90 fw-645" >{cat.label}</div>
                            {
                                cat.issues.map(issue => (
                                    <div key={uniqueId()} className="my-1">
                                        <LinkedIssueRibbon 
                                            issue={issue}
                                            category={cat.label}
                                            onRemove={()=>{
                                                setIssueOnStage({category: cat.label, issue}); setConfirmModal(true);
                                            }}
                                        />
                                    </div>
                                ))
                            }
                            
                        </div>
                    ))
                }
            </div>
            {
                creator &&
                <div className='mt-2'>
                    <LinkedIssueCreator 
                        onCancel={() => {
                            if (props.onToggle) {
                                props.onToggle(false);
                            }
                            else {
                                setCreator(false); 
                            }
                        }}
                    />
                </div>
            }

            <Modal
                show={confirmModal}
            >
                <Modal.Header>
                    <div  className="fw-bold">
                        {`Remove the link to ${issueOnStage?.issue.projectKey}-${issueOnStage?.issue.id}?`}
                    </div>
                    
                </Modal.Header>
                <Modal.Body >
                    You can add it again later if you need to.
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex flex-nowrap'>
                        <div className="me-2">
                            <Button 
                                label='Remove'
                                disabled={projectCommonQuery.loading}
                                extraClasses="btn-as-warning p-1"
                                handleClick={handleRemove}
                            />
                        </div>
                        <div>
                            <Button 
                                label='Cancel'
                                extraClasses='btn-as-light p-1'
                                handleClick={()=>{ setConfirmModal(false) }}
                            />
                        </div>
                        
                    </div>
                </Modal.Footer>
            </Modal>
            
        </div>
    )
}

export default LinkedIssue;