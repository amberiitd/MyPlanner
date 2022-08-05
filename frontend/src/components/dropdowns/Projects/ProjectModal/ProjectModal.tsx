import { FC } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../../Button/Button';
import MenuCard from '../../../MenuCard/MenuCard';
import './ProjectModal.css';

interface ProjectModalProps{
    showModal: boolean;
    handleCancel: () => void;
}

const ProjectModal: FC<ProjectModalProps> = (props) => {

    return (
            <Modal
                show={props.showModal}
                fullscreen={true}
                backdrop='static'
                dialogClassName='modal-dialog-scrollable font-theme'
                onHide={() => {console.log(props.showModal)}}
            >
                <Modal.Body className='py-0'>
                    <div className='row border h-100'>
                        <div className='col-3 sidebar h-100 border'>
                            <div className='d-flex flex-nowrap py-3'>
                                <Button 
                                    label='Cancel'
                                    hideLabel={true}
                                    bsIcon='x-lg'
                                    extraClasses='bg-light'
                                    handleClick={props.handleCancel}                
                                />
                            </div>
                            <div className=''>
                                <MenuCard 
                                    label='Project Templates'
                                    menuItems={[
                                        {
                                            label: "Software development",
                                            value: "software-development",

                                        },
                                        {
                                            label: "Service management",
                                            value: "service-management",
                                            
                                        },
                                        {
                                            label: "Work management",
                                            value: "work-management",
                                            
                                        }
                                    ]}
                                    selectedItem={{
                                        label: "Software development",
                                        value: "software-development",

                                    }}
                                    handleClick={(valu: string) => {}}
                                />
                            </div>
                        </div>
                        <div className='col h-100 border'>

                        </div>

                    </div>
                    
                </Modal.Body>
            </Modal>
            
    )
}

export default ProjectModal;