import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';
import DropdownAction from '../../DropdownAction/DropdownAction';
import NumberInput from '../../input/NumberInput/NumberInput';
import Assignee from '../Assignee/Assignee';
import IssueType from '../IssueType/IssueType';
import Project from '../Project/Project';
import Sprint from '../Sprint/Sprint';
import StoryPoint from '../StoryPoint/StoryPoint';
import Summary from '../Summary/Summary';
import './CreateNew.css';

interface CreateNewProps{

}

const CreateNew: FC<CreateNewProps> = (props) => {
    const [showModal, setShowModal]= useState(false);

    return (
        <div className='d-flex align-items-center mx-2'>
            <div className='d-none d-lg-block' >
                <Button 
                    label='Create'
                    rightBsIcon='plus-lg'
                    hideIcon={true}
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <div className='d-block d-lg-none' >
                <Button 
                    label='Create'
                    hideLabel={true}
                    rightBsIcon='plus-lg'
                    extraClasses='btn-as-thm p-1'
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <Modal
                show={showModal}
                backdrop='static'
                size='lg'
                dialogClassName='modal-dialog-scrollable font-theme'
            >
                <Modal.Header className=''>
                    <div>
                        <h4>Create issue</h4>
                    </div>
                    <div className='d-flex flex-nowrap ms-auto'>
                        <DropdownAction 
                            actionCategory={[
                                {
                                    label: 'Action',
                                    items: [
                                        {
                                            label: 'Show Fields',
                                            value: 'fields'
                                        }
                                    ]
                                }
                            ]}
                            handleItemClick={()=> {}}
                        />
                    </div>
                    
                </Modal.Header>
                <Modal.Body>
                    <div className='create-select mb-3'>
                        <Project 
                        />
                    </div>
                    <div className='create-select'>
                        <IssueType />
                    </div>
                    <hr className='my-4 text-muted'/>
                    <div className='mb-3'>
                        <Summary />
                    </div>
                    <div className='create-select mb-3'>
                        <Assignee />
                    </div>

                    <div className='create-select mb-3'>
                        <Sprint />
                    </div>

                    <div className='create-select mb-3'>
                        <StoryPoint />
                    </div>
                    
                </Modal.Body>
                <Modal.Footer>
                    <div className='me-auto flex-start'>Create Another Issue</div>
                    <div className='d-flex flex-nowrap'>
                        <Button 
                            label='Close'
                            extraClasses='btn-as-link'
                            handleClick={()=>{ setShowModal(false) }}
                        />
                        <Button 
                            label='Create'
                            handleClick={()=>{  }}
                        />
                    </div>
                    
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CreateNew;