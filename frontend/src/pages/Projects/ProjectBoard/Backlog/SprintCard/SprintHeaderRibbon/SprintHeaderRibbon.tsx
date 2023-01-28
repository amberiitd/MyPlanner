import { FC, useCallback, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeSprint } from '../../../../../../app/slices/sprintSlice';
import Badge from '../../../../../../components/Badge/Badge';
import Button from '../../../../../../components/Button/Button';
import DropdownAction from '../../../../../../components/DropdownAction/DropdownAction';
import { completeSprintModalService, sprintModalService } from '../../../../../../modal.service';
import { SprintStatus } from '../../../../../../model/types';
import './SprintHeaderRibbon.css';

interface SprintHeaderRibbonProps{
    label: string;
    metric: {
        storyPoints: { label: string; value: number; color?: string;}[];
        status: SprintStatus;
        issueCount: number;
    };
    sprintId: string;
    collapse: boolean;
    handleClick: () => void;
    handleDelete: () => void;
}

const SprintHeaderRibbon: FC<SprintHeaderRibbonProps> = (props) => {
    const [modal, setModal] = useState<{
        show: boolean;
        mode: 'start' | 'edit';
    }>({
        show: false,
        mode: 'edit'
    });
    const handleActionClick = useCallback((event: any) => {
        switch(event.item.value){
            case 'delete':
                props.handleDelete();
                break;
            case 'edit':
                sprintModalService.setProps({
                    mode: 'edit',
                    sprintId: props.sprintId
                });
                sprintModalService.setShowModel(true);
                break;
            default:
                break;
        }
    }, []);
    const dispatch = useDispatch();
    return (
        <div className='d-flex flex-nowrap align-items-center w-100 px-1'>
            <div className='w-100 py-1' onClick={props.handleClick}>
                <i className='bi bi-chevron-right' hidden={!props.collapse}></i>
                <i className='bi bi-chevron-down' hidden={props.collapse}></i>
                <span className='mx-1'>{props.label}</span>
                <span className='mx-1 text-muted'>{`(${props.metric.issueCount} issues)`}</span>
            </div>
            <div className='d-flex flex-nowrap align-items-center ms-auto'>
                {
                    props.metric.storyPoints.map((item, index) => (
                        <div className='mx-1' key={`storypoint-badge-${index}`} title={`${item.label}-Story points`}>
                            <Badge
                                data={item.value}
                                extraClasses={`bg-${item.color?? 'thm'}`}
                            />
                        </div>
                        
                    ))
                }
                <div className='mx-1'>
                    <Button
                        label={props.metric.status === 'active'? 'Complete sprint': (props.metric.status ==='complete'? 'Completed': 'Start sprint')}
                        handleClick={()=>{
                            if (props.metric.status == 'not-started'){
                                sprintModalService.setProps({
                                    mode: 'start',
                                    sprintId: props.sprintId
                                });
                                sprintModalService.setShowModel(true);
                            }else if (props.metric.status === 'active'){
                                completeSprintModalService.setProps({
                                    sprintIds: [props.sprintId]
                                });
                                completeSprintModalService.setShowModel(true)
                            }
                            
                        }}
                        disabled={(props.metric.issueCount === 0 && props.metric.status === 'not-started') || props.metric.status ==='complete'}
                    />
                </div>
                <div className='mx-1'>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Actions',
                                value: 'actions',
                                items:[
                                    {
                                        label: 'Delete sprint',
                                        value: 'delete'
                                    },
                                    {
                                        label: 'Edit sprint',
                                        value: 'edit'
                                    }
                                ]
                            }
                        ]} 
                        buttonClass='btn-as-bg p-1 px-2'
                        bsIcon='three-dots'
                        handleItemClick={handleActionClick}
                    />
                </div>
            </div>
        </div>
    )
}

export default SprintHeaderRibbon;