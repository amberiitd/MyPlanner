import { isEmpty, uniqueId } from 'lodash';
import { FC, useCallback, useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import projectModalService, { projectCreateModalService } from '../../../../modal.service';
import { ModalViewType } from '../../../BreadCrumb/BreadCrumb';
import Button from '../../../Button/Button';
import TextInput from '../../../input/TextInput/TextInput';
import { ProjectContext } from '../ProjectModal/ProjectModal';
import './ProjectCreateModal.css';
import StepCard from './StepCard/StepCard';
import { useDispatch } from 'react-redux';
import { addProject } from '../../../../app/slices/projectSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../app/store';
import { API, Auth } from 'aws-amplify';
import { CrudPayload, Project } from '../../../../model/types';
import { useNavigate } from 'react-router-dom';
import { projectsCrud } from '../../../../services/api';

export interface StepItem{
    label: 'Template' | 'Template type',
    value: 'template' | 'templateType'
    selectedItem: {
        label: string;
        value: string;
    },
    descText: string,
    viewType: ModalViewType
}

interface ProjectCreateModalProps{
    showModal: boolean;
    handleCancel: () => void;
    selectedStepItems: StepItem[];
}

const ProjectCreateModal: FC<ProjectCreateModalProps> = (props) => {
    const [projectName, setProjectName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const {setCurrentViewType} = useContext(ProjectContext) as any;
    const cancelProcess =() => {
        props.handleCancel();
        projectModalService.setShowModel(false);
    }
    const projects  = useSelector((state: RootState) => state.projects.values);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createProject = useCallback(() => {
        const index = projects.findIndex(p => p.key === projectKey);
        if (index >= 0 || isEmpty(projectKey) || isEmpty(projectName)){
            return;
        }
        const newProject: Project = props.selectedStepItems.reduce((pre: any, cur) => {
            pre[cur.value] = cur.selectedItem.value;
            return pre;
        }, {
            key: projectKey, 
            name: projectName,
            id: uniqueId('project'),
            managementType: 'team-managed'
        });

        const payload: CrudPayload = {
            itemType: 'project',
            action: 'CREATE',
            data: newProject
        }
        projectsCrud(payload)
        .then(res => {
            const body = JSON.parse(res.body);
            if (isEmpty(res.errorMessage) && isEmpty(body.errorMessage)){
                dispatch(addProject(newProject))
                cancelProcess();
                navigate(`/myp/projects/${projectKey}/board`)
            }else{
                console.log(res)
            }
        })
        .catch(err => console.log(err));
        
    }, [projectName, projectKey, props.selectedStepItems]);
    
    return (
        <Modal
                show={props.showModal}
                fullscreen={true}
                backdrop='static'
                dialogClassName='modal-dialog-scrollable font-theme'
                onHide={() => {console.log(props.showModal)}}
            >
                <Modal.Body className='py-3 bg-light'>
                    <div className=' modal-container'>
                        <div className='px-3 d-flex'>
                            <div>
                                <Button 
                                    label='Back to project templates'
                                    leftBsIcon='arrow-left'
                                    extraClasses='btn-as-bg px-3 p-1'
                                    handleClick={props.handleCancel}
                                />
                            </div>
                        </div>
                        <form className='form-container1'
                            onSubmit={(e) => {
                                e.preventDefault();
                                createProject();
                            }}
                        >
                            <div className='px-3 d-flex justify-content-center align-items-center h-100'>
                                <div>
                                    <div className='form-body d-flex flex-nowrap justify-content-between'>
                                        <div className='form-col'>
                                            <div>
                                                <h4 className='fw-bold'>Add project details</h4>
                                                <p>
                                                    You can change these details anytime in your project settings.
                                                </p>
                                                <div className='mb-3'>
                                                    <TextInput 
                                                        label='Name'
                                                        isRequired={true} 
                                                        value={projectName}
                                                        placeholder='Enter project name'
                                                        handleChange={(value: string)=>{setProjectName(value)}}
                                                    />
                                                </div>
                                                <div>
                                                    <TextInput 
                                                        label='Key'
                                                        isRequired={true} 
                                                        value={projectKey}
                                                        handleChange={(value: string)=>{setProjectKey(value)}}
                                                    />
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className='form-col'>
                                            <StepCard 
                                                label='Create Project'
                                                stepItems={props.selectedStepItems
                                                    .filter(item => !isEmpty(item))
                                                    .map(item => ({
                                                        label: item.label,
                                                        selectedItem: {
                                                            label: item.selectedItem.label,
                                                            descText: item.descText
                                                        },
                                                        handleRefClick: ()=> { 
                                                            props.handleCancel();
                                                            setCurrentViewType({value: item.viewType})
                                                        }
                                                    }))
                                                }                                
                                            />
                                        </div>
                                    </div>
                                    <hr />
                                    <div className='form-footer py-3 d-flex flex-nowrap'>
                                        <div className='ms-auto me-2'>
                                            <Button 
                                                label='Cancel'
                                                extraClasses='btn-as-light px-3 py-1'
                                                handleClick={cancelProcess}
                                            />
                                        </div>
                                        <button type ='submit'>
                                            <Button 
                                                label='Create'
                                                handleClick={()=>{}}
                                            />
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
                        </form>
                    </div>
                </Modal.Body>
        </Modal>
    )
}

export default ProjectCreateModal;