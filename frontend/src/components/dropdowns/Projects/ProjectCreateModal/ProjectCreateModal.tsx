import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import projectModalService, { projectCreateModalService } from '../../../../modal.service';
import Button from '../../../Button/Button';
import TextInput from '../../../input/TextInput/TextInput';
import './ProjectCreateModal.css';
import StepCard from './StepCard/StepCard';

interface ProjectCreateModalProps{
    showModal: boolean;
    handleCancel: () => void;
    selectedStepItems: any[];
}

const ProjectCreateModal: FC<ProjectCreateModalProps> = (props) => {
    const [projectName, setProjectName] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const cancelProcess =() => {
        props.handleCancel();
        projectModalService.setShowModel(false);
    }
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
                        <div className='form-container1'>
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
                                                stepItems={props.selectedStepItems.map(item => ({
                                                    label: item.stepLabel,
                                                    selectedItem: {
                                                        label: item.label,
                                                        descText: item.descText
                                                    },
                                                    handleRefClick: ()=> {}
                                                }))}                                
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
                                                <div>
                                                    <Button 
                                                        label='Create'
                                                        handleClick={()=>{}}
                                                    />
                                                </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </Modal.Body>
        </Modal>
    )
}

export default ProjectCreateModal;