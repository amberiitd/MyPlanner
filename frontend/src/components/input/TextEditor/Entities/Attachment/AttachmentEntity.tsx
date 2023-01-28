import moment from "moment";
import { FC, useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { IssueAttachment } from "../../../../../model/types";
import { IssueViewContext } from "../../../../../pages/Projects/ProjectBoard/IssueView/IssueView";
import Button from "../../../../Button/Button";
import Table, { ColDef } from "../../../../Table/Table";

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

const AttachmentEntity: FC<{onInput: (entity: any)=> void; show: boolean; onToggle: (value: boolean)=>void;}> = (props) => {
    const {openIssue} = useContext(IssueViewContext);
    const [selectedAttach, setSelectedAttach] = useState<any>();

    return (
        <Modal
            className='p-3'
            show={props.show}
            size='lg'
        >
            <Modal.Header>
                <div className='pb-2 h4'>
                    Attachments on this issue ({(openIssue?.attachments || []).length > 0 ? openIssue?.attachments?.length: 0})
                </div>
            </Modal.Header>
            <Modal.Body>
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
                                }
                            ],
                            layout: 'button',
                            handleAction: (row: IssueAttachment, event) =>{
                            }
                        }}
                        rowClickable
                        selectable
                        onSelectionChange={(rows)=>{
                            if (rows.length > 0){
                                setSelectedAttach(rows[0]);
                            }else{
                                setSelectedAttach(undefined);
                            }
                        }}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex flex-nowrap'>
                    <Button 
                        label='Close'
                        extraClasses='btn-as-link px-3 py-1'
                        handleClick={()=>{ props.onToggle(false);  setSelectedAttach(undefined); }}
                    />
                    <Button 
                        label='Insert'
                        handleClick={()=>{
                            props.onInput({
                                type: 'attachment',
                                mutability: 'IMMUTABLE',
                                data: selectedAttach
                            })
                            props.onToggle(false);
                            setSelectedAttach(undefined);
                        }}
                        disabled={!selectedAttach}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AttachmentEntity;