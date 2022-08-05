import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import BreadCrumb from '../../../BreadCrumb/BreadCrumb';
import Button from '../../../Button/Button';
import MenuCard from '../../../MenuCard/MenuCard';
import './ProjectModal.css';
import { projectTemplate } from './projectTemplateData';
import TemplateCard from './TemplateCard/TemplateCard';

interface ProjectModalProps{
    showModal: boolean;
    handleCancel: () => void;
}

const ProjectModal: FC<ProjectModalProps> = (props) => {
    const [selectedCrumb, setSelectedCrumb] = useState(projectTemplate.children[0])
    const handleCrumbSelection = (item: any) => {
        if (item.value !== projectTemplate.value){
            setSelectedCrumb(item);
        }
    }
    return (
            <Modal
                show={props.showModal}
                fullscreen={true}
                backdrop='static'
                dialogClassName='modal-dialog-scrollable font-theme'
                onHide={() => {console.log(props.showModal)}}
            >
                <Modal.Body className='py-0 bg-light'>
                    <div className='row border h-100 flex-nowrap modal-container'>
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
                                    menuItems={projectTemplate.children}
                                    selectedItem={{
                                        label: "Software development",
                                        value: "software-development",

                                    }}
                                    handleClick={(valu: string) => {}}
                                />
                            </div>
                        </div>
                        <div className='col h-100 border p-4 template'>
                            <div>
                                <BreadCrumb 
                                    itemTree={projectTemplate}
                                    selectedItem={selectedCrumb}
                                    handleClick={handleCrumbSelection}
                                />
                            </div>
                            <div>
                                <TemplateCard 
                                    label={selectedCrumb.label} 
                                    description={selectedCrumb.descText} 
                                    items={selectedCrumb.children}
                                    handleClick={handleCrumbSelection}
                                />
                            </div>
                        </div>
                        
                    </div>
                    
                </Modal.Body>
            </Modal>
            
    )
}

export default ProjectModal;