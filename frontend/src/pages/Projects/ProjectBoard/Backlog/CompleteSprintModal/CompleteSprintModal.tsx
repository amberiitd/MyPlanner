import { isEmpty } from 'lodash';
import { FC, useContext, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateIssueBulk } from '../../../../../app/slices/issueSlice';
import { removeSprint, updateSprint } from '../../../../../app/slices/sprintSlice';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import { useQuery } from '../../../../../hooks/useQuery';
import { completeSprintModalService } from '../../../../../modal.service';
import { CrudPayload, Sprint } from '../../../../../model/types';
import { commonCrud, IssuesCrud, projectCommonCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import './CompleteSprintModal.css';

const CompleteSprintModal: FC = () => {
    const {openProject} = useContext(ProjectBoardContext);
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const issueQuery = useQuery((payload: CrudPayload) => IssuesCrud(payload));
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const [selectedSprint, setSelectedSprint] = useState<{label: string; value: string;} | undefined>(undefined);
    const [transferToSprint, setTransferToSprint] = useState<{label: string; value: string;} | undefined>({
        label: 'Backlog',
        value: 'backlog'
    });

    const dispatch = useDispatch();
    const [modal, setModal] = useState<{
        show: boolean;
        props: any;
    }>({
        show: false,
        props: {

        }
    });

    useEffect(() => {
        completeSprintModalService.subscribe(() => {
            setModal({
                show: completeSprintModalService.getShowModal(),
                props: completeSprintModalService.getProps()
            });
        });
    }, [])

    const activeSprints = useMemo(() => {
        return sprints.values.filter(sp => (modal.props.sprintIds || []).findIndex((id: any) => id === sp.id)>= 0)
    }, [sprints, modal.props]);
    const metric = useMemo<{
        completedIssueCount: number,
        openIssueCount: number,
        openIssueIds: string[]
    }>(() => {
        if (activeSprints.length > 0){
            const sprintIssues = issues.values.filter(iss => (activeSprints.findIndex(sp => sp.id === iss.sprintId) >= 0));
            const notDone = sprintIssues.filter(iss => iss.stage !== 'done');
            setSelectedSprint({label: activeSprints[0].sprintName, value: activeSprints[0].id});
            return {
                completedIssueCount: sprintIssues.filter(iss => iss.stage === 'done').length,
                openIssueCount: notDone.length,
                openIssueIds: notDone.map(issue => issue.id)
            }
        }
        return {
            completedIssueCount: 0,
            openIssueCount: 0,
            openIssueIds: []
        }
    }, [activeSprints, issues]);

    return (
        <Modal show={modal.show} >
            <Modal.Header>
                <div>
                    <h4>{`Complete sprint `}{ activeSprints.length == 1 ? `: ${activeSprints[0].projectKey} ${activeSprints[0].sprintName}`: ''}</h4>
                </div>
            </Modal.Header>
            <Modal.Body className='complete-sprint-modal-body'>
                { 
                    activeSprints.length > 1 &&
                    <div className='w-50 mt-2'>
                        <Select 
                            label='Select a sprint to complete'
                            selectedItem={selectedSprint}
                            data={[{
                                label: 'Active Sprints',
                                items: activeSprints
                                    .map(sp => ({
                                        label: sp.sprintName,
                                        value: sp.id
                                    }))
                            }]}
                            onSelectionChange={(item: any)=> {
                                setSelectedSprint(item);
                            }}
                        />
                    </div>
                }

                <div className='mt-2'>
                    <p>This sprint contains:</p>
                    <ul>
                        <li>{metric.completedIssueCount} <span>completed issues</span></li>
                        <li>{metric.openIssueCount} <span>open issues</span></li>
                    </ul>
                </div>
                { 
                    metric.openIssueCount > 0 &&
                    <div className='w-50 mt-2'>
                        <Select 
                            label='Move open issues to'
                            selectedItem={{
                                label: 'Backlog',
                                value: 'backlog'
                            }}
                            data={[{
                                label: 'MOVE TO ',
                                items: activeSprints
                                    .map(sp => ({
                                        label: `${sp.projectKey} ${sp.sprintName}`,
                                        value: sp.id
                                    }))
                                    .concat([{
                                        label: 'Backlog',
                                        value: 'backlog'
                                    }])
                            }]}
                            onSelectionChange={(item: any)=> {
                                setTransferToSprint(item);
                            }}
                        />
                    </div>
                }
                
            </Modal.Body>
            <Modal.Footer>
            <div className='d-flex flex-nowrap'>
                    <Button 
                        label='Close'
                        extraClasses='btn-as-link px-3 py-1'
                        handleClick={()=>{ completeSprintModalService.setShowModel(false) }}
                        disabled={projectCommonQuery.loading || issueQuery.loading}
                    />
                    
                    <Button 
                        label={'Complete sprint'}
                        handleClick={()=>{
                            const completeSprint = (id: string) => {
                                const data = {sprintStatus: 'complete'};
                                projectCommonQuery.trigger({
                                    action: 'UPDATE',
                                    data: {
                                        projectId: openProject?.id,
                                        id,
                                        ...data
                                    },
                                    itemType: 'sprint'
                                } as CrudPayload)
                                .then(()=>{
                                    dispatch(updateSprint({
                                        id, 
                                        data
                                    }));
                                    completeSprintModalService.setShowModel(false);
                                });
                            };
                            
                            if (metric.openIssueCount > 0 ){
                                const ids = metric.openIssueIds;
                                if (isEmpty(ids) && selectedSprint){
                                    completeSprint(selectedSprint.value);
                                }else if(transferToSprint){
                                    issueQuery.trigger({
                                        action: 'ASSIGN_SPRINT',
                                        data: {
                                            ids,
                                            projectId: openProject?.id,
                                            sprintId: transferToSprint.value
                                        }
                                    } as CrudPayload)
                                    .then(()=>{
                                        dispatch(updateIssueBulk({
                                            ids,
                                            data: {
                                                sprintId: transferToSprint.value
                                            }
                                        }));
                                        if (selectedSprint)
                                        activeSprints.forEach(sp =>{
                                            completeSprint(selectedSprint.value);
                                        });
                                    });
                                }
                            }
                            
                        }}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default CompleteSprintModal;