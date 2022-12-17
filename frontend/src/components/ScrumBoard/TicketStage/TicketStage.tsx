import { clone, isEmpty, startCase, toLower, toString, toUpper } from 'lodash';
import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../../../app/slices/issueSlice';
import { updateProject } from '../../../app/slices/projectSlice';
import { RootState } from '../../../app/store';
import { useQuery } from '../../../hooks/useQuery';
import { CrudPayload, IssueStage } from '../../../model/types';
import { Issue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/IssueRibbon';
import { StageValue } from '../../../pages/Projects/ProjectBoard/Backlog/IssueRibbon/StageSelector/stages';
import { ProjectBoardContext } from '../../../pages/Projects/ProjectBoard/ProjectBoard';
import { commonChildCrud, commonCrud, projectCommonCrud } from '../../../services/api';
import DropdownAction from '../../DropdownAction/DropdownAction';
import EditableText from '../../EditableText/EditableText';
import CircleRotate from '../../Loaders/CircleRotate';
import WindowSlider from '../../WindowSlider/WindowSlider';
import { ScrumContext } from '../ScrumBoard';
import TicketCard from '../TicketCard/TicketCard';
import './TicketStage.css';

interface TicketStageProps{
    index: number;
    issues: Issue[];
    stage: IssueStage;
}

const TicketStage: FC<TicketStageProps> = (props) => {
    const stageRef = useRef<HTMLDivElement>(null);
    const {openProject} = useContext(ProjectBoardContext);
    const dispatch = useDispatch();
    const [hover, setHover] = useState(false);
    const metric = useMemo(()=>({ticketCount: props.issues.length}), [props.issues])
    const {orderedStages} = useContext(ScrumContext);    
    const projectIssues = useSelector((state: RootState) => state.issues.values.filter(issue => issue.projectKey === openProject?.key));
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const commonChildQuery = useQuery((payload: CrudPayload) => commonChildCrud(payload));

    const [{isOver}, drop] = useDrop(()=> ({
        accept: 'issue',
        drop: (item: any, monitor) => {
            if(!monitor.didDrop()){
                projectCommonQuery.trigger({
                    action: 'UPDATE',
                    data: {
                        id: item.id,
                        projectId: openProject?.id,
                        stage: props.stage.value
                    },
                    itemType: 'issue'
                } as CrudPayload)
                .then(()=>{
                    dispatch(updateIssue({id: item.id, data: {stage: props.stage.value}}));
                })
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [])

    const [{isDragging, didDrop}, drag] = useDrag(()=>({
        type: "stage",
        item: {...props.stage, index: props.index},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
            didDrop: !!monitor.didDrop()
        })
    }))

    const [{isStageOver}, stageDrop] = useDrop(()=> ({
        accept: 'stage',
        drop: (item: any, monitor) => {
            if (item.index === props.index) return;

            const newOrder = orderedStages.map(stage => stage.value);
            const itemIndex = orderedStages.findIndex(stage => stage.value === item.value);
            const dropIndex = orderedStages.findIndex(stage => stage.value === props.stage.value);
            newOrder.splice(itemIndex, 1);
            newOrder.splice(dropIndex, 0, item.value);
            commonQuery.trigger({
                action: 'UPDATE',
                data: {
                    id: openProject?.id,
                    subPath: 'scrumBoard',
                    stageOrder: newOrder
                },
                itemType: 'project'
            } as CrudPayload)
            .then(()=>{
                dispatch(updateProject({key: openProject?.key || '', data: {
                    scrumBoard: {
                        ...(openProject?.scrumBoard || {}),
                        stageOrder: newOrder
                    }
                }}))
            });
        },
        collect: (monitor) => ({
            isStageOver: !!monitor.isOver()
        })
    }), [])

    const handleAction = (action: any) => {
        if (action.item.value === 'delete'){
            if (isEmpty(props.issues)){
                const stages = (openProject?.scrumBoard.stages || []).filter(stage => stage.value !== props.stage.value);
                commonChildQuery.trigger({
                    action: 'DELETE',
                    data: {
                        parentId: openProject?.id,
                        subPath: 'scrumBoard',
                        childCurrentIndex: props.index,
                        itemType: 'stages'
                    },
                    itemType: 'project'
                } as CrudPayload)
                .then(()=>{
                    dispatch(updateProject({key: openProject?.key || '', data: {
                        scrumBoard: {
                            stages,
                            stageOrder: stages.map(stage => stage.value)
                        }
                    }}));
                });
            }
        }
    }

    const handleTicketDrop = (event: any) => {
        const issue = projectIssues.find(item => item.id === event.itemId);
        
        if (issue && issue.stage !== props.stage.value){
            projectCommonQuery.trigger({
                action: 'UPDATE',
                data: {
                    id: event.itemId,
                    projectId: openProject?.id,
                    stage: props.stage.value
                },
                itemType: 'issue'
            } as CrudPayload)
            .then(()=>{
                dispatch(updateIssue({id: event.itemId, data: {stage: props.stage.value}}));
            })
        }
        if (event.insertIdx === undefined || event.insertIdx < 0) return; // check for index

        let newOrder = props.issues.map(issue => issue.id);
        const orderIndex = newOrder.findIndex((id) => id === event.itemId);
        if (orderIndex < 0){
            newOrder.push(event.itemId);
        }else if(orderIndex !== event.insertIdx){
            newOrder.splice(orderIndex, 1);
            newOrder.splice(event.insertIdx, 0, event.itemId);
        }
        const stages = [... (openProject?.scrumBoard.stages || [])];
        stages.splice(props.index, 1, {
            ...stages[props.index],
            issueOrder: newOrder
        });

        commonChildQuery.trigger({
            action: 'UPDATE',
            data: {
                parentId: openProject?.id,
                subPath: 'scrumBoard',
                childCurrentIndex: props.index,
                itemType: 'stages',
                issueOrder: newOrder
            },
            itemType: 'project'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateProject({key: openProject?.key || '', data: {
                scrumBoard: {
                    ...(openProject?.scrumBoard|| {}),
                    stages 
                }
            }}));
        });
    }


    return (
        <div ref={drag}  className='position-relative'>
            <div className={`h-100 ${isStageOver? 'bg-thm-2': ''} position-absolute left-0`} style={{width: '5px'}}>

            </div>
            <div ref={stageDrop}>
                <div ref={drop} id="target" className='p-2 pb-3 bg-light rounded-3 ticket-stage overflow-auto'>
                    <div className='d-flex flex-nowrap stage-header mb-2 position-relative'
                        onMouseEnter={()=> {setHover(true)}}
                        onMouseLeave={()=> {setHover(false)}}
                    >
                        <div className='w-100 d-flex'
                        >
                            <EditableText 
                                value={`${toUpper(props.stage.label)}`} 
                                prefix={` ${metric.ticketCount} ${metric.ticketCount > 1 ? 'ISSUES': 'ISSUE'}`}
                                onSave={(value)=>{
                                    if (value.length < 3) return;
                                    let stages = [...(openProject?.scrumBoard.stages || [])];
                                    stages.splice(props.index, 1, {...stages[props.index], label: value})
                                    commonChildQuery.trigger({
                                        action: 'UPDATE',
                                        data: {
                                            parentId: openProject?.id,
                                            subPath: 'scrumBoard',
                                            childCurrentIndex: props.index,
                                            itemType: 'stages',
                                            label: value
                                        },
                                        itemType: 'project'
                                    } as CrudPayload)
                                    .then(()=>{
                                        dispatch(updateProject({key: openProject?.key || '', data: {
                                            scrumBoard: {
                                                stages
                                            }
                                        }}));
                                    });
                                }}                            
                            />
                            <div hidden={!(commonChildQuery.loading || commonQuery.loading || projectCommonQuery.loading)}>
                                <CircleRotate loading={true}/>
                            </div>
                        </div>

                        <div className='ms-auto position-absolute' hidden={!hover} style={{top: 0, right: 0, zIndex: 2}}>
                            <DropdownAction 
                                actionCategory={[
                                    {
                                        label: 'Action',
                                        value: 'action',
                                        items: [
                                            {
                                                label: 'Set column limit',
                                                value: 'column-limit'
                                            },
                                            {
                                                label: 'Delete',
                                                value: 'delete'
                                            }
                                        ],
                                    }
                                ]}
                                bsIcon='three-dots'
                                handleItemClick={handleAction}                    />
                        </div>
                    </div>
                    {
                        
                        props.issues.map((item, index)=> (
                            <div id={`ticket-${props.stage.value}-${item.id}`} key={`item-${index}`} className='mb-2'
                                style={{}}
                            >
                                <TicketCard
                                        index={index}
                                        issue={item}
                                        handleMenuClick={(event: any)=> {} }                           
                                        onClick={(event1: any)=> {} } 
                                        onTicketDrop={handleTicketDrop}                           
                                    />
                            </div>
                        ))
                    }
                    
                </div>
            </div>
        </div>
    )
}

export default TicketStage;