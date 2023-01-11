import { FC, useCallback, useContext} from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateIssue } from '../../../../../app/slices/issueSlice';
import Button from '../../../../../components/Button/Button';
import TextInput from '../../../../../components/input/TextInput/TextInput';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload } from '../../../../../model/types';
import { projectCommonCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueViewContext } from '../IssueView';

export interface SimpleWebLink{
    href: string;
    label: string;
}

interface WebLinkCreatorProps{
    onCancel: () => void;
}
const WebLinkCreator: FC<WebLinkCreatorProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const {openIssue} = useContext(IssueViewContext);

    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const dispatch = useDispatch();

    const defaultValues: SimpleWebLink = {
        href: '',
        label: ''
    };

    const {handleSubmit, formState: {errors}, setValue, control} = useForm({
        defaultValues
    });

    const handleNew = useCallback((data: any) =>{
        let webLinks = (openIssue?.webLinks || []);
        webLinks = [...webLinks, data];
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
            props.onCancel();
        })
    }, [openIssue, openProject]);
    return (
        <div className=''>
            <div className='d-flex'>
                <Controller 
                    control={control}
                    name='href'
                    rules={{
                        validate: (value) => value.startsWith('http') || value.startsWith('www.') 
                    }}
                    render={({ field: {value} })=>(
                        <div className='w-50 me-2'>
                            <TextInput 
                                label={'URL'}
                                value={value} 
                                placeholder='https://www.example.com'
                                handleChange={(value)=>{setValue('href', value)}} 
                            />
                            {
                                errors.href &&
                                <div className='ms-1 text-danger f-80'>
                                    Url is invalid
                                </div>
                            }
                        </div>
                    )}
                />
                <Controller 
                    control={control}
                    name='label'
                    rules={{
                        validate: (value) => value.length > 3
                    }}
                    render={({ field: {value} })=>(
                        <div className='w-50'>
                        <TextInput 
                                label={'Link text'}
                                placeholder="Add a description..."
                                value={value} 
                                handleChange={(value)=>{setValue('label', value)}} 
                            />
                            {
                                errors.label &&
                                <div className='ms-1 text-danger f-80'>
                                    Link text is too short.
                                </div>
                            }
                        </div>
                    )}
                />
            </div>
            <div className='d-flex flex-nowrap my-2'>
                <div className='ms-auto'>
                    <Button 
                        label={'Add'} 
                        handleClick={handleSubmit(handleNew)} 
                        disabled={projectCommonQuery.loading}                       
                    />
                </div>
                <div className='ms-2'>
                    <Button 
                        label={'Cancel'} 
                        extraClasses='btn-as-light  p-1'
                        handleClick={props.onCancel}                        
                    />
                </div>
            </div>
        </div>
    )
}

export default WebLinkCreator;