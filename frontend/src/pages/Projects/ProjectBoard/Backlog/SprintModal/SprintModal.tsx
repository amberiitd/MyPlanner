import { isEmpty, max, min, startCase } from 'lodash';
import moment from 'moment';
import { FC, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateSprint } from '../../../../../app/slices/sprintSlice';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import DateInput from '../../../../../components/input/DateInput/DateInput';
import Select from '../../../../../components/input/Select/Select';
import TextAreaInput from '../../../../../components/input/TextAreaInput/TextAreaInput';
import TextInput from '../../../../../components/input/TextInput/TextInput';
import { sprintModalService } from '../../../../../modal.service';
import { Sprint } from '../../../../../model/types';
import './SprintModal.css';

export interface Duration{
    label: string;
    unit: 'days';
    value: number;
}

const SprintModal: FC = () => {
    const sprints = useSelector((state: RootState) => state.sprints.values)
    const [sprint, setSprint] = useState<Sprint | undefined>();
    const dispatch  = useDispatch();

    const [form, setForm] = useState<{
        name: string;
        duration: Duration | 'custom';
        startTimestamp?: number;
        endTimestamp?: number;
        goal?: string;
    }>({
        name: '',
        duration: 'custom'
    });
    const [sprintModal, setSprintModal] = useState<{
        show: boolean;
        props: any;
    }>({
        show: false,
        props: {
            mode: 'edit',
            sprintId: ''
        }
    });

    const durations = [
        {
            label: '1 week',
            value: 7,
            unit: 'days'
        },
        {
            label: '2 weeks',
            value: 14,
            unit: 'days'
        },
        {
            label: '3 weeks',
            value: 21,
            unit: 'days'
        },
        {
            label: '4 weeks',
            value: 28,
            unit: 'days'
        },
        {
            label: 'Custom',
            value: 'custom',
            unit: 'none'
        }
    ];

    useEffect(()=>{
        sprintModalService.subscribe(()=>{
            setSprintModal({
                show: sprintModalService.getShowModal(),
                props: sprintModalService.getProps()
            });
        })
    }, []);

    useEffect(() => {
        setSprint(sprints.find(sp => sp.id === sprintModal.props.sprintId));
    }, [sprints, sprintModal.props])

    useEffect(() => {
        setForm({...form, name: sprint?.name || `${sprint?.projectKey} Sprint ${sprint?.index}`})
    }, [sprint])
    
    return (
        <Modal
            show={sprintModal.show}
            className='font-theme'
            // dialogClassName='modal-dialog-scrollable font-theme'
        >
            <Modal.Header className=''>
                <div>
                    <h4>{`${startCase(sprintModal.props.mode)} sprint: `}{ sprint?.name?? `${sprint?.projectKey} Sprint ${sprint?.index}`}</h4>
                </div>
            </Modal.Header>
            <Modal.Body className='sprint-modal-body'>
                <div className='w-50 mt-2'>
                    <TextInput 
                        label='Sprint name'
                        value={form.name}
                        isRequired={true}
                        hidePlaceholder={true}
                        handleChange={(name: string)=> { setForm({...form, name})}}
                    />
                </div>
                <div className='w-50 mt-2'>
                    <Select 
                        label='Duration'
                        isRequired={sprintModal.props.mode === 'start'}
                        selectedItem={form.duration === 'custom' ? { label: 'Custom', value: 'custom' } : form.duration}
                        data={[
                            {
                                label: 'Durations',
                                items: durations
                            }
                        ]}
                        onSelectionChange={(item: any)=> {
                            if (item.value === 'custom'){
                                setForm({...form, duration: 'custom'})
                            }else{
                                setForm({...form, duration: item as Duration, endTimestamp: form.startTimestamp? moment.unix(form.startTimestamp).add(item.value, item.unit).unix(): undefined})
                            }
                        }}
                    />
                </div>
                <div className='w-50 mt-2'>
                    <DateInput 
                        label='Start date'
                        value={form.startTimestamp}
                        clearButton={true}
                        isRequired={sprintModal.props.mode === 'start'}
                        handleChange={(value: string) => {
                            if (form.duration === 'custom' && value){
                                setForm({ ...form, startTimestamp: moment(value).unix(), endTimestamp: max([moment(value).unix(), form.endTimestamp || 0])})
                            }
                            else if (!value){
                                setForm({...form, startTimestamp: undefined, endTimestamp: undefined})
                            }
                            else if(form.duration !== 'custom'){
                                const startTimestamp = moment(value).unix();
                                const endTimestamp = moment(value).add(form.duration.value, form.duration.unit).unix();
                                setForm({ ...form, startTimestamp, endTimestamp });
                            } 
                        }}
                    />
                </div>

                <div className='w-50 mt-2'>
                    <DateInput 
                        label='End date'
                        isRequired={sprintModal.props.mode === 'start'}
                        value={form.endTimestamp}
                        minDate={form.startTimestamp}
                        clearButton={true}
                        disabled={form.duration !== 'custom'}
                        handleChange={(value: string) => {setForm({ ...form, endTimestamp: value? moment(value).unix(): undefined})}}
                    />
                </div>

                <div className='mt-2'>
                    <TextAreaInput 
                        label='Sprint goal'
                        value={form.goal || ''}
                        handleChange={(value: string) => {setForm({...form, goal: value})}}
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex flex-nowrap'>
                    <Button 
                        label='Close'
                        extraClasses='btn-as-link px-3 py-1'
                        handleClick={()=>{ sprintModalService.setShowModel(false) }}
                    />
                    <Button 
                        label={sprintModal.props.mode ==='start'? 'Start': 'Update'}
                        handleClick={()=>{ 
                            if (!isEmpty(form.name)
                                && (sprintModal.props.mode === 'edit' || (form.startTimestamp && form.endTimestamp))
                            ){
                                dispatch(updateSprint({
                                    id: sprint?.id || '', 
                                    data: {...form, status: sprintModal.props.mode === 'start'? 'active': sprint?.status}
                                }))
                                sprintModalService.setShowModel(false);
                            }
                        }}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SprintModal;