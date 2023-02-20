import { uniqueId } from "lodash";
import { FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateIssue } from "../../../../../app/slices/issueSlice";
import Button from "../../../../../components/Button/Button";
import { useQuery } from "../../../../../hooks/useQuery";
import { CrudPayload } from "../../../../../model/types";
import { projectCommonCrud } from "../../../../../services/api";
import { ProjectBoardContext } from "../../ProjectBoard";
import { IssueMainViewContext } from "../IssueMainView/IssueMainView";
import { IssueViewContext } from "../IssueView";
import WebLinkCreator from "./WebLinkCreator";
import WebLinkRibbon from "./WebLinkRibbon";

interface WebLinkProps{
    active?: boolean;
    onToggle?: (active: boolean) => void;
}

const WebLink: FC<WebLinkProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const [confirmModal, setConfirmModal] = useState(false);
    const [creator, setCreator] = useState(false);
    const {openIssue} = useContext(IssueMainViewContext);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [linkOnStage, setLinkOnStage] = useState<{href: string; label: string} | undefined>(undefined);
    const dispatch = useDispatch();
    
    const handleRemove = useCallback(() =>{
        let webLinks = (openIssue?.webLinks || []).filter(link => link.href !== linkOnStage?.href);
        projectCommonQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                id: openIssue?.id,
                webLinks
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateIssue({id: openIssue?.id || '', data: {
                webLinks
            }}));
            setConfirmModal(false);
        })
    }, [openProject, linkOnStage, openIssue])

    useEffect(()=>{
        setCreator(!!props.active);
    }, [props])
    return (
        <div>
            <div className='d-flex flex-nowrap'>
                <div className='h6'>
                    Web Links
                </div>
                <div className='ms-auto' >
                    <Button 
                        label='Create'
                        hideLabel={true}
                        rightBsIcon='plus-lg'
                        extraClasses='btn-as-bg p-1 ps-2'
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
                    (openIssue?.webLinks || []).map((link, index) => (
                        <div key={`web-link-${index}`} className="my-1">
                            <WebLinkRibbon 
                                link={link}
                                onRemove={()=>{
                                    setLinkOnStage(link); setConfirmModal(true);
                                }}
                            />
                        </div>
                    ))
                }
            </div>
            {
                creator &&
                <div className='mt-2'>
                    <WebLinkCreator 
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
                        Delete the web link?
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

export default WebLink;