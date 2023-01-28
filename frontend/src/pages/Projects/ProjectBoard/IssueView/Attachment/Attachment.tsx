import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import Button from "../../../../../components/Button/Button";
import { Storage } from "aws-amplify";
import { isEmpty, uniqueId } from "lodash";
import { useQuery } from "../../../../../hooks/useQuery";
import { CrudPayload, fileExtentions, IssueAttachment, SimpleAction } from "../../../../../model/types";
import { projectCommonCrud } from "../../../../../services/api";
import { updateIssue } from "../../../../../app/slices/issueSlice";
import { useDispatch } from "react-redux";
import { ProjectBoardContext } from "../../ProjectBoard";
import { IssueViewContext } from "../IssueView";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { AuthContext } from "../../../../../components/route/AuthGuardRoute";
import DropdownAction from "../../../../../components/DropdownAction/DropdownAction";
import Table, { ColDef } from "../../../../../components/Table/Table";
import CircleRotate from "../../../../../components/Loaders/CircleRotate";


export interface Attach{
    loading: boolean;
    progress: number;
    data?: File;
    name: string;
    type: string;
    error?: {
        message: string;
    };
    timestamp: number;
    size: number;
    path: string;
}

interface AttachmentProps{
    active?: boolean;
    onToggle?: (active: boolean) => void;
}

const colDef: ColDef[] = [
    {
        label: 'Name',
        value: 'name',
        sortable: true,
        extraClasses: 'text-cut'
    },
    {
        label: 'Size',
        valueGetter: (row: IssueAttachment) => row.size !== undefined ? `${(row.size / 1000)} KB`: '-',
        sortable: true,
    },
    {
        label: 'Data added',
        valueGetter: (row: IssueAttachment) => moment.unix(row.updatedAt).format('YYYY-MM-DD HH:mm:SS')
    }
];

const Attachment: FC<AttachmentProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const {authUser} = useContext(AuthContext);
    const {openIssue} = useContext(IssueViewContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const [confirmModal, setConfirmModal] = useState(false);
    const [previewModal, setPreviewModal] = useState(false);
    const [preview, setPreview] = useState(false);
    const [viewType, setViewType] = useState<'list' | 'card'>('card');

    useEffect(() =>{
        if (props.active){
            inputRef.current?.click();
            if (props.onToggle) props.onToggle(false);
        }
    }, [props.active])
    const [error, setError] = useState('');
    const [attach, setAttach] = useState<Attach | undefined>(undefined);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [attachOnStage, setAttachOnStage] = useState<IssueAttachment & {url?: string;} | undefined>(undefined);
    const dispatch = useDispatch();

    const handleRemove = useCallback(() =>{
        let attachments = (openIssue?.attachments || []).filter(attach => attach.path !== attachOnStage?.path);
        projectCommonQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                id: openIssue?.id,
                attachments
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateIssue({id: openIssue?.id || '', data: {
                attachments
            }}));
            setConfirmModal(false);
        })
    }, [openProject, attachOnStage, openIssue])

    const downloadAttachment = (path: string) =>{
        Storage.get(path, {
            customPrefix: {
                public: ""
            }
        }).then( url =>{
            window.open(url);
        }).catch(error => {
            console.log(error);
        })
    }

    const handleAttachAction = useCallback((action: {attachPath: string; actionType: string;})=>{
        const attach = (openIssue?.attachments || []).find(attach => attach.path === action.attachPath);
        if(action.actionType === 'delete'){
            setAttachOnStage(attach);
            setConfirmModal(true);
        }else if(action.actionType === 'download'){
            downloadAttachment(action.attachPath);
        }else if(action.actionType === 'view'){
            Storage.get(action.attachPath, {
                customPrefix: {
                    public: ""
                }
            }).then(url => {
                if (attach) setAttachOnStage({...attach, url});
            })
            setPreviewModal(true);
        }
    }, [openIssue]);

    return (
        <div>
            <div className='d-flex flex-nowrap'>
                <div className='h6'>
                    Attachment {(openIssue?.attachments || []).length > 0 ? `(${openIssue?.attachments?.length})`: ''}
                </div>
                <div className='ms-auto' >
                    <DropdownAction 
                        actionCategory={[{
                            label: 'Action',
                            value: 'action',
                            items: [
                                {
                                    label: `Switch to ${viewType === 'list'? 'card': 'list'} view`,
                                    value: 'switch'
                                },
                                {
                                    label: `Download all (${(openIssue?.attachments || []).length})`,
                                    value: 'download-all'
                                },
                                {
                                    label: 'Delete all',
                                    value: 'delete-all'
                                }
                            ]
                        }]} 
                        bsIcon='three-dots'
                        buttonClass='btn-as-bg p-1 px-2'
                        handleItemClick={(action)=>{
                            if (action.item.value === 'switch'){
                                setViewType(viewType === 'card'? 'list': 'card')
                            }
                        }}                    
                    />
                </div>
                <div className='' >
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
                                setError('');
                                inputRef.current?.click();
                            }
                        }}
                    />
                    <input ref={inputRef} className="d-none" type="file" 
                        onChange={(e)=>{
                            if (props.onToggle) props.onToggle(false);
                            if (!e.target.files) return;
                            const file = e.target.files[0];
                            const nameParts = file.name.split('.');
                            const path = `dev/private/${openProject?.key}/${file.name}`;
                            const attach = {
                                loading: true,
                                progress: 0,
                                data: file,
                                name: file.name,
                                type: nameParts.length > 1? nameParts[1]: 'file',
                                timestamp: moment().unix(),
                                size: file.size,
                                path
                            };
                            setAttach(attach);
                            Storage.put(path, file,{
                                contentType: file.type,
                                level: 'public',
                                customPrefix: {
                                    public: ""
                                },
                                progressCallback: (progress)=> {
                                    setAttach({
                                        ...attach,
                                        progress: (progress.loaded / progress.total)*100
                                    });
                                },
                            }).then(async (res: any) => {
                                if (!isEmpty(res.failure)){
                                    throw new Error('upload failed');
                                }
                                const attachments: IssueAttachment[] = [
                                    {
                                        path,
                                        updatedAt: attach.timestamp,
                                        updatedBy: authUser.data.attributes.email || '',
                                        name: attach.name,
                                        type: attach.type,
                                        size: file.size
                                    }, 
                                    ...(openIssue?.attachments || [])
                                ];
                                projectCommonQuery.trigger({
                                    action: 'UPDATE',
                                    data: {
                                        projectId: openProject?.id,
                                        id: openIssue?.id,
                                        attachments
                                    },
                                    itemType: 'issue'
                                } as CrudPayload)
                                .then(()=>{
                                    dispatch(updateIssue({id: openIssue?.id || '', data: {
                                        attachments
                                    }}));
                                    setAttach(undefined);
                                });
                            })
                            .catch((error) => {
                                console.log(error);
                                setAttach({
                                    ...attach,
                                    loading: false,
                                    error: {
                                        message: 'Upload error'
                                    }
                                })
                            });
                            if(inputRef.current) inputRef.current.value = '';
                        }}
                    />
                </div>
            </div>
            {
                viewType === 'card' &&
                <div className="w-100 d-flex flex-nowrap overflow-auto mt-1">
                    {
                        attach && 
                        <div className="mx-1">
                            <AttachCard 
                                path={attach.path} 
                                updatedAt={attach.timestamp} 
                                updatedBy={""} 
                                name={attach.name} 
                                type={attach.type}
                                loading={attach.loading}
                                progress={attach.progress}
                                size={attach.size}
                                onAction={()=>{}}
                            />
                        </div>
                    }
                    {
                        (openIssue?.attachments || []).map(attach => (
                            <div key={uniqueId()} className="mx-1">
                                <AttachCard 
                                    {...attach}
                                    onAction={handleAttachAction}
                                />
                            </div>
                        ))
                    }
                </div>
            }
            {
                viewType === 'list' &&
                <div className='w-100 overflow-auto mt-1'>
                    <Table 
                        data={openIssue?.attachments || []}
                        colDef={colDef}
                        actions={{
                            items: [
                                {
                                    label: 'Download',
                                    value: 'download',
                                    buttonClasses: 'btn-as-bg p-1 px-2',
                                    bsIcon: 'cloud-arrow-down',
                                    hideLabel: true
                                },
                                {
                                    label: 'delete',
                                    value: 'delete',
                                    bsIcon: 'trash3',
                                    buttonClasses: 'btn-as-bg p-1 px-2',
                                    hideLabel: true
                                }
                            ],
                            layout: 'button',
                            handleAction: (row: IssueAttachment, event) =>{
                                const actionType = event.value;
                                if (event.value === 'row-click'){
                                    handleAttachAction({attachPath: row.path, actionType: 'view'});
                                }else{
                                    handleAttachAction({attachPath: row.path, actionType: event.value});
                                }
                            }
                        }}
                        rowClickable
                    />
                </div>
            }
            <Modal
                show={confirmModal}
                onHide={() =>{setAttachOnStage(undefined)}}
            >
                <Modal.Header>
                    <div  className="fw-bold">
                        Delete this attachment?
                    </div>
                    
                </Modal.Header>
                <Modal.Body >
                    Once you delete, it's gone for good.
                </Modal.Body>
                <Modal.Footer>
                    <div className='d-flex flex-nowrap'>
                        <div className="me-2">
                            <Button 
                                label='Delete'
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

            <Modal
                fullscreen
                show={previewModal}
            >
                <Modal.Body className="py-2">
                    <div className='d-flex flex-nowrap px-2'>
                        <div className="d-flex">
                            <div>
                                <i className="bi bi-file-earmark text-muted" style={{fontSize: '200%'}}></i>
                            </div>
                            <div className="ms-2 f-80 py-1">
                                <div className="fw-645">
                                    {attachOnStage?.name}
                                </div>
                                <div>
                                    {attachOnStage?.updatedAt ? moment.unix(attachOnStage.updatedAt).format('YYYY-MM-DD HH:mm:SS'): '-'}
                                </div>
                            </div>
                        </div>
                        <div className="mx-2"><CircleRotate loading={!preview} /></div>
                        <div className="ms-auto">
                            <Button
                                label="Download"
                                hideLabel={true}
                                leftBsIcon="cloud-arrow-down"
                                extraClasses="btn-as-light p-1 px-2"
                                handleClick={()=>{
                                    if (attachOnStage) downloadAttachment(attachOnStage?.path);
                                }}
                            />
                        </div>
                        <div className="ms-2">
                            <Button 
                                label='Cancel'
                                hideLabel
                                leftBsIcon="x-lg"
                                extraClasses='btn-as-light p-1 px-2'
                                handleClick={()=>{ setPreviewModal(false) }}
                            />
                        </div>
                    </div>
                    {/* <div className="h100-3em d-flex justify-content-center overflow-auto">
                        <img className="" src={attachOnStage?.url} height='100%'/>
                    </div> */}
                    {
                        attachOnStage &&
                        <div className="h100-3em d-flex justify-content-center overflow-auto">
                            <iframe 
                                src={attachOnStage?.url}
                                width='100%'
                                height='100%'
                                onLoad={(e)=>{
                                    setPreview(true);
                                }}
                            ></iframe>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Attachment;

export const AttachCard: FC<IssueAttachment & {loading?: boolean; progress?: number; onAction: (action: {attachPath: string; actionType: string;}) => void;}> = (props) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
            className="border shadow-sm rounded position-relative cursor-pointer" 
            style={{width: '12em', height: '9em'}}
            onMouseEnter={()=>{setHover(true)}}
            onMouseLeave={()=>{setHover(false)}}
            onClick={()=>{props.onAction({actionType: 'view', attachPath: props.path})}}
        >
            {
                (hover && !props.loading) &&
                <div className="position-absolute" style={{right: 5, top: 5, zIndex: 1000}}>
                    <div className="d-flex">
                        <div>
                            <Button
                                label="Download"
                                hideLabel={true}
                                leftBsIcon="cloud-arrow-down"
                                extraClasses="btn-as-light px-1"
                                handleClick={()=>{
                                    props.onAction({attachPath: props.path, actionType: 'download'});
                                }}
                            />
                        </div>
                        <div className="ms-1">
                            <Button
                                label="delete"
                                hideLabel={true}
                                leftBsIcon="trash3"
                                extraClasses="btn-as-light px-1"
                                handleClick={()=>{
                                    props.onAction({attachPath: props.path, actionType: 'delete'});
                                }}
                            />
                        </div>
                    </div>
                </div>
            }
            <div className="d-flex justify-content-center align-items-center" style={{height: '70%'}}>
                <i className={`bi bi-${fileExtentions[props.type]?.bsIcon || 'file-earmark'} text-muted`} style={{fontSize: '200%'}}></i>
            </div>
            <div className="bg-thm rounded-bottom pb-1 px-2 " style={{height: '30%', opacity: 0.8}}>
                <div className="f-80 fw-645 text-cut" title={props.name}>
                    {props.name}
                </div>
                <div className="f-80">
                    {moment.unix(props.updatedAt).format('YYYY-MM-DD HH:mm:SS')}
                </div>
            </div>

        </div>
    )
}