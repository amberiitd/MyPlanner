import { createContext, FC, useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { projectCreateModalService } from '../../../../modal.service';
import BreadCrumb, { BreadCrumbItem } from '../../../BreadCrumb/BreadCrumb';
import Button from '../../../Button/Button';
import MenuCard from '../../../MenuCard/MenuCard';
import ProjectCreateModal from '../ProjectCreateModal/ProjectCreateModal';
import './ProjectModal.css';
import { projectTemplate } from './projectTemplateData';
import TemplateCard from './TemplateCard/TemplateCard';
import TemplateInfo from './TemplateInfo/TemplateInfo';

interface ProjectModalProps{
    showModal: boolean;
    handleCancel: () => void;
}
export const ProjectContext = createContext({});
const ProjectModal: FC<ProjectModalProps> = (props) => {
    const [selectedCrumb, setSelectedCrumb] = useState<BreadCrumbItem | undefined>(projectTemplate.children[0]);
    const [currentViewType, setCurrentViewType] = useState({value: ''});
    const [selectedTemplateType, setSelectedTemplateType] = useState<any>({
        label: projectTemplate.children[0].label,
        value : projectTemplate.children[0].value,
    })
    const [selectedTemplate, setSelectedTemplate] = useState<BreadCrumbItem | undefined>()
    const handleCrumbSelection = (item: BreadCrumbItem) => {
        if (item.value !== projectTemplate.value){
            setSelectedCrumb(item);
        }
        if (item.viewType === 'template-info'){
            setSelectedTemplate(item);
        }
    }

    const [showProjectModal, setShowProjectModal] = useState(projectCreateModalService.getShowModal());

    useEffect(()=>{
        projectCreateModalService.subscribe(()=>{
            setShowProjectModal(projectCreateModalService.getShowModal());
        })
    }, [])

    useEffect(()=>{
        setSelectedCrumb(projectTemplate.children.find((child: any) => child.value === selectedTemplateType.value))
    }, [selectedTemplateType]);

    return (
            <Modal
                show={props.showModal}
                fullscreen={true}
                dialogClassName='modal-dialog-scrollable font-theme'
                onShow={()=> {setSelectedCrumb(projectTemplate.children[0])}}
            >
                <Modal.Body className='py-0 bg-light'>
                    <ProjectContext.Provider value={{viewType: currentViewType, setCurrentViewType}}>
                    <div className='d-flex flex-nowrap h-100 flex-nowrap modal-container position-relative'>
                        <div className='sidebar h-100 position-absolute left-0'>
                            <div className='d-flex flex-nowrap py-3'>
                                <Button 
                                    label='Cancel'
                                    hideLabel={true}
                                    rightBsIcon='x-lg'
                                    extraClasses='btn-as-bg p-1'
                                    handleClick={props.handleCancel}                
                                />
                            </div>
                            <div className=''>
                                <div className='h4 p-2'>Project Templates</div>
                                <MenuCard 
                                    label='Project Templates'
                                    menuItems={projectTemplate.children.map((child: any) => ({
                                        label: child.label,
                                        value: child.value
                                    }))}
                                    selectedItem={selectedTemplateType}
                                    handleClick={(value: string) => {
                                        setSelectedTemplateType(projectTemplate.children.find((child: any) => child.value === value))
                                    }}
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
                                    selectedCrumb?.viewType === 'template-list' ? (
                                        <div className='template-card'>
                                            <TemplateCard 
                                                label={selectedCrumb.label} 
                                                description={selectedCrumb.descText} 
                                                items={selectedCrumb.children}
                                                handleClick={handleCrumbSelection}
                                            />
                                        </div>
                                    ):
                                    selectedCrumb?.viewType === 'template-info' ? (
                                        <div className='template-info'>
                                            <TemplateInfo 
                                                label={selectedCrumb.label} 
                                                descText={selectedCrumb.info?.descText} 
                                                infoItem={selectedCrumb.info?.item}
                                                handleCancel={() => {
                                                    setSelectedTemplateType({...selectedTemplateType})
                                                }}
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
                    <ProjectCreateModal 
                        showModal={showProjectModal}
                        handleCancel={()=>{projectCreateModalService.setShowModel(false)}}
                        selectedStepItems={[
                            {
                                label: 'Template type',
                                value: 'templateType',
                                selectedItem: {
                                    label: selectedTemplateType.label,
                                    value: selectedTemplateType.value
                                },
                                descText: 'Sprint toward your project goals with a board, backlog, and roadmap.',
                                viewType: 'template-list'
                            },
                            {
                                label: 'Template',
                                value: 'template',
                                selectedItem:{
                                    label: selectedTemplate?.label || '-',
                                    value: selectedTemplate?.value || '-'
                                },
                                descText: 'Sprint toward your project goals with a board, backlog, and roadmap.',
                                viewType: 'template-list'
                            }
                        ]}
                    />
                    </ProjectContext.Provider>
                </Modal.Body>
            </Modal>
            
    )
}

export default ProjectModal;