import { isEmpty, max, min, startCase } from 'lodash';
import moment from 'moment';
import { FC, useEffect, useMemo, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updateSprint } from '../../../../../app/slices/sprintSlice';
import { RootState } from '../../../../../app/store';
import Button from '../../../../../components/Button/Button';
import DateInput from '../../../../../components/input/DateInput/DateInput';
import Select from '../../../../../components/input/Select/Select';
import TextAreaInput from '../../../../../components/input/TextAreaInput/TextAreaInput';
import TextInput from '../../../../../components/input/TextInput/TextInput';
import { useQuery } from '../../../../../hooks/useQuery';
import { sprintModalService } from '../../../../../modal.service';
import { CrudPayload, Sprint } from '../../../../../model/types';
import { commonCrud } from '../../../../../services/api';
import './SprintModal.css';

export interface Duration{
    label: string;
    unit: 'days';
    value: number;
}

const SprintModal: FC = () => {
    const sprints = useSelector((state: RootState) => state.sprints.values)
    const dispatch  = useDispatch();
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const durations = [
        {
            label: '1 week',
            code: '1-week',
            value: 7,
            unit: 'day'
        },
        {
            label: '2 weeks',
            code: '2-weeks',
            value: 14,
            unit: 'day'
        },
        {
            label: '3 weeks',
            code: '3-weeks',
            value: 21,
            unit: 'day'
        },
        {
            label: '4 weeks',
            code: '4-weeks',
            value: 28,
            unit: 'day'
        },
        {
            label: 'Custom',
            code: 'custom',
            value: 'custom',
            unit: 'none'
        }
    ];
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
    const sprint = useMemo(()=> sprints.find(sp => sp.id === sprintModal.props.sprintId), [sprints, sprintModal.props]);
    
    const defaultValues = useMemo(() => ({
        sprintName: sprint?.sprintName ,
        sprintDuration: sprint?.sprintDuration || durations[0].code,
        startTimestamp: sprint?.startTimestamp || moment().unix(),
        endTimestamp: sprint?.endTimestamp || moment().add(durations[0].value, durations[0].unit as any).unix(),
        goal: sprint?.goal || ''
    }), [sprint]);

    const { control, handleSubmit, formState: {errors}, setValue, getValues, watch, reset, resetField, trigger} = useForm({
        defaultValues 
    });
    const formValues = watch();
    
    useEffect(()=>{
        sprintModalService.subscribe(()=>{
            setSprintModal({
                show: sprintModalService.getShowModal(),
                props: sprintModalService.getProps()
            });
        })
    }, []);

    useEffect(()=>{
        reset({
            sprintName: sprint?.sprintName,
            sprintDuration: sprint?.sprintDuration || durations[0].code,
            startTimestamp: sprint?.startTimestamp || moment().unix(),
            endTimestamp: sprint?.endTimestamp || moment().add(durations[0].value, durations[0].unit as any).unix(),
            goal: sprint?.goal || '',
        });
    }, [sprint])
    
    return (
        <Modal
            show={sprintModal.show}
            className='font-theme'
            // dialogClassName='modal-dialog-scrollable font-theme'
        >
            <Modal.Header className=''>
                <div>
                    <h4>{`${startCase(sprintModal.props.mode)} sprint: `}{ sprint?.sprintName?? `${sprint?.projectKey} Sprint ${sprint?.index}`}</h4>
                </div>
            </Modal.Header>
            <Modal.Body className='sprint-modal-body'>
                <div className='w-50 mt-2'>
                    <Controller 
                        control={control}
                        rules={{
                            required: true,
                            minLength: 3
                        }}
                        render={({field: {value, onBlur}}) =>(
                            <TextInput 
                                label='Sprint name'
                                value={value || ''}
                                isRequired={true}
                                hidePlaceholder={true}
                                handleChange={(name: string)=> { 
                                    setValue("sprintName", name);
                                }}
                                onBlur={(e)=> {
                                    trigger('sprintName');
                                }}
                                error={errors.sprintName && 'Name is invalid'}
                            />
                        )}
                        name="sprintName"
                    />
                </div>
                <div className='w-50 mt-2'>
                    <Controller 
                        control={control}
                        render={({field: {value}})=>(
                            <Select 
                                label='Duration'
                                isRequired={sprintModal.props.mode === 'start'}
                                selectedItem={durations.find(d => d.code === value)}
                                data={[
                                    {
                                        label: 'Durations',
                                        items: durations
                                    }
                                ]}
                                onSelectionChange={(item: any)=> {
                                    setValue('sprintDuration', item.code);
                                    if (item.code !== 'custom' && getValues('startTimestamp') > 0){
                                        setValue('endTimestamp', moment.unix(getValues('startTimestamp')).add(item.value, item.unit).unix())
                                    }
                                }}
                            />
                        )}
                        name="sprintDuration"
                    />
                </div>
                <div className='w-50 mt-2'>
                    <Controller 
                        control={control}
                        render={({field: {value}})=>(
                            <DateInput 
                                label='Start date'
                                value={value}
                                clearButton={true}
                                isRequired={sprintModal.props.mode === 'start'}
                                handleChange={(value: string) => {
                                    const duration = durations.find(d => d.code === getValues('sprintDuration'));
                                    const endtime = getValues('endTimestamp') || moment().unix();
                                    if (duration?.code === 'custom' && value){
                                        setValue('startTimestamp', moment(value).unix());
                                        setValue('endTimestamp', max([moment(value).unix(), endtime]) || moment().unix())
                                    }
                                    else if (!value){
                                        setValue('startTimestamp', moment().unix());
                                        setValue('endTimestamp', moment().unix());
                                    }
                                    else if(duration?.code !== 'custom'){
                                        const startTimestamp = moment(value).unix();
                                        const endTimestamp = moment(value).add(duration?.value, (duration?.unit || 'day') as any).unix();
                                        setValue('startTimestamp', startTimestamp);
                                        setValue('endTimestamp', endTimestamp);
                                    } 
                                }}
                            />
                        )}
                        name='startTimestamp'
                    />
                </div>

                <div className='w-50 mt-2'>
                    <Controller 
                        control={control}
                        render={({field: {value}})=>(
                            <DateInput 
                                label='End date'
                                isRequired={sprintModal.props.mode === 'start'}
                                value={value}
                                minDate={formValues.startTimestamp}
                                clearButton={true}
                                disabled={formValues.sprintDuration !== 'custom'}
                                handleChange={(value: string) => {
                                    setValue('endTimestamp', value? moment(value).unix(): moment().unix())
                                }}
                            />
                        )}
                        name="endTimestamp"
                    />
                </div>

                <div className='mt-2'>
                <Controller 
                        control={control}
                        render={({field: {value}})=>(
                            <TextAreaInput 
                                label='Sprint goal'
                                value={value}
                                handleChange={(value: string) => {setValue('goal', value)}}
                            />
                        )}
                        name="goal"
                    />
                </div>

            </Modal.Body>
            <Modal.Footer>
                <div className='d-flex flex-nowrap'>
                    <Button 
                        label='Close'
                        extraClasses='btn-as-link px-3 py-1'
                        handleClick={()=>{ reset(defaultValues); sprintModalService.setShowModel(false) }}
                    />
                    <Button 
                        label={sprintModal.props.mode ==='start'? 'Start': 'Update'}
                        disabled={commonQuery.loading}
                        handleClick={()=>{ 
                            handleSubmit((form)=>{
                                const data = {...form, sprintStatus: sprintModal.props.mode === 'start'? 'active': sprint?.sprintStatus};
                                commonQuery.trigger({
                                    action: 'UPDATE',
                                    data: {
                                        id: sprint?.id || '',
                                        ...data
                                    },
                                    itemType: 'sprint'
                                } as CrudPayload)
                                .then(()=>{
                                    dispatch(updateSprint({
                                        id: sprint?.id || '', 
                                        data
                                    }));
                                    reset(defaultValues);
                                    sprintModalService.setShowModel(false);
                                });
                            })()
                        }}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default SprintModal;
