import { FC, useEffect, useState } from 'react';
import { projectCreateModalService } from '../../../../../modal.service';
import Button from '../../../../Button/Button';
import ProjectCreateModal from '../../ProjectCreateModal/ProjectCreateModal';
import './TemplateInfo.css';

interface TemplateInfoProps{
    label: string;
    descText: string;
    infoItem: { 
        label: string; 
        descText: string, 
        learnMoreLabel: string; 
        learnMoreTo: string;
    }[];
}

const TemplateInfo: FC<TemplateInfoProps> = (props) => {
    const [showProjectModal, setShowProjectModal] = useState(projectCreateModalService.getShowModel());

    useEffect(()=>{
        projectCreateModalService.subscribe(()=>{
            setShowProjectModal(projectCreateModalService.getShowModel());
        })
    }, [])
    const infoLetLayout = (info: any, index=0) => {
        const layoutClass = 'row flex-nowrap py-4 border-bottom';
        const key =`${props.label}-info-layout-${index}`;
        const icon = (
            <div className='col-4 d-flex align-items-center justify-content-center'>
                <i className='bi bi-text-paragraph border' style={{fontSize: '700%'}}></i>
            </div>
        );
        const body = (
            <div className='col'>
                <h6>{info.label}</h6>
                <p>
                    {info.descText}
                </p>
                <a>{info.learnMoreLabel}</a>
            </div>
        )
        return index%2 ? (
            <div className={layoutClass} key={key}>
                {icon}
                {body}
            </div>
        ): (
            <div className={layoutClass} key={key}>
                {body}
                {icon}
            </div>
        )
    }

    return (
        <div className=' d-flex justify-content-center'>
            <div className='info shadow-sm border'>
                <div className='info-header d-flex flex-nowrap align-items-center py-4 px-5  border'>
                    <div className='h4 fw-bold'>
                        {props.label}
                    </div>
                    <div className='d-flex flex-nowrap ms-auto'>
                        <div className='me-2'>
                            <Button 
                                label='Use template'
                                extraClasses='btn-as-white px-3 py-1'
                                handleClick={()=> {projectCreateModalService.setShowModel(true)}}                     
                            />
                        </div>
                        <div>
                            <Button 
                                label='Cancel'
                                hideLabel={true}
                                rightBsIcon='x-lg'
                                extraClasses='btn-as-bg p-1'
                                handleClick={()=> {}}                     
                            />
                        </div>
                    </div>
                </div>
                <div className='px-5 info-body row flex-nowrap'>
                    <div className='col'>
                        <div className='py-3 border-bottom '>
                            {props.descText}
                        </div>
                        {
                            props.infoItem.map((item, index) => (
                                infoLetLayout(item, index)
                            ))
                        }
                    </div>
                    <div className='col-3'>

                    </div>

                </div>
                <div className='info-footer px-5 d-flex flex-nowrap align-items-center py-4'>
                        <div className='ms-auto'>
                            <Button 
                                label='Use template' 
                                handleClick={()=> {}}                     
                            />
                        </div>
                </div>
            </div>
            <ProjectCreateModal 
                showModal={showProjectModal}
                handleCancel={()=>{projectCreateModalService.setShowModel(false)}}
                selectedStepItems={[
                    {
                        stepLabel: 'Template',
                        label: props.label,
                        descText: 'Sprint toward your project goals with a board, backlog, and roadmap.'
                    }
                ]}
            />
        </div>
    )
}

export default TemplateInfo;