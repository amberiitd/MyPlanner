import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import BreadCrumb from '../../../BreadCrumb/BreadCrumb';
import Button from '../../../Button/Button';
import MenuCard from '../../../MenuCard/MenuCard';
import './ProjectModal.css';
import { projectTemplate } from './projectTemplateData';
import TemplateCard from './TemplateCard/TemplateCard';
import TemplateInfo from './TemplateInfo/TemplateInfo';

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
                dialogClassName='modal-dialog-scrollable font-theme'
                onShow={()=> {setSelectedCrumb(projectTemplate.children[0])}}
            >
                <Modal.Body className='py-0 bg-light'>
                    <div className='d-flex flex-nowrap h-100 flex-nowrap modal-container position-relative'>
                        <div className='sidebar h-100 position-absolute left-0'>
                            <div className='d-flex flex-nowrap py-3'>
                                <Button 
                                    label='Cancel'
                                    hideLabel={true}
                                    rightBsIcon='x-lg'
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
                        <div className='h-100 p-4 template w-100'>
                            <div>
                                <BreadCrumb 
                                    itemTree={projectTemplate}
                                    selectedItem={selectedCrumb}
                                    handleClick={handleCrumbSelection}
                                />
                            </div>
                            <div className='template-body'>
                                {
                                    selectedCrumb.viewType === 'templateCard' ? (
                                        <div className='template-card'>
                                            <TemplateCard 
                                                label={selectedCrumb.label} 
                                                description={selectedCrumb.descText} 
                                                items={selectedCrumb.children}
                                                handleClick={handleCrumbSelection}
                                            />
                                        </div>
                                    ):
                                    selectedCrumb.viewType === 'templateInfo' ? (
                                        <div className='template-info'>
                                            <TemplateInfo 
                                                label={selectedCrumb.label} 
                                                descText={selectedCrumb.info?.descText} 
                                                infoItem={selectedCrumb.info?.item}                                        
                                            />
                                        </div>
                                    ):
                                    (<div></div>)
                                }

                                {/* <div className='template-card'>
                                    <TemplateCard 
                                        label={selectedCrumb.label} 
                                        description={selectedCrumb.descText} 
                                        items={selectedCrumb.children}
                                        handleClick={handleCrumbSelection}
                                    />
                                </div> */}
                                
                                
                                
                            </div>
                        </div>
                        
                    </div>
                    
                </Modal.Body>
            </Modal>
            
    )
}

export default ProjectModal;