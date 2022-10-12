import { FC, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import Select from '../../../../../components/input/Select/Select';
import { completeSprintModalService } from '../../../../../modal.service';
import { Sprint } from '../../../../../model/types';
import './CompleteSprintModal.css';

const CompleteSprintModal: FC = () => {
    const sprints = useSelector((state: RootState) => state.sprints);
    const issues = useSelector((state: RootState) => state.issues);
    const [sprint, setSprint] = useState<Sprint | undefined>();
    const [metric, setMetric] = useState({
        completedIssueCount: 0,
        openIssueCount: 0
    });

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

    useEffect(() => {
        setSprint(sprints.values.find(sp => sp.id === modal.props.sprintId));
    }, [sprints, modal.props])

    useEffect(() => {
        if (sprint){
            setMetric({
                completedIssueCount: issues.values.filter(iss => iss.sprintId === sprint.id && iss.stage === 'done').length,
                openIssueCount: issues.values.filter(iss => iss.sprintId === sprint.id && iss.stage !== 'done').length
            })
        }
    }, [sprint, issues])

    return (
        <Modal show={modal.show} >
            <Modal.Header>
                <div>
                    <h4>{`Complete sprint: `}{ sprint?.name?? `${sprint?.projectKey} Sprint ${sprint?.index}`}</h4>
                </div>
            </Modal.Header>
            <Modal.Body className='complete-sprint-modal-body'>
                <div>
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
                                items: sprints.values
                                    .filter(sp => sp.projectKey === sprint?.projectKey)
                                    .map(sp => ({
                                        label: `${sprint?.projectKey} Sprint ${sp.index}`,
                                        value: sp.id
                                    }))
                                    .concat([{
                                        label: 'Backlog',
                                        value: 'backlog'
                                    }])
                            }]}
                            onSelectionChange={(item: any)=> {
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
                    />
                    <Button 
                        label={'Complete sprint'}
                        handleClick={()=>{ 
                            
                        }}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default CompleteSprintModal;