import { FC, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';
import DropdownAction from '../../DropdownAction/DropdownAction';
import IssueType from '../IssueType/IssueType';
import Project from '../Project/Project';
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
                    bsIcon='plus-lg'
                    hideIcon={true}
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <div className='d-block d-lg-none' >
                <Button 
                    label='Create'
                    hideLabel={true}
                    bsIcon='plus-lg'
                    handleClick={()=>{ setShowModal(true) }}
                />
            </div>
            <Modal
                show={showModal}
                backdrop='static'
                size='lg'
                dialogClassName='modal-dialog-scrollable'
            >
                <Modal.Header className=''>
                    <div>
                        <h4>Create issue</h4>
                    </div>
                    <div className='d-flex flex-nowrap ms-auto'>
                        <DropdownAction 
                            menuItems={[
                                {
                                    label: 'Show Fields',
                                    value: 'fields'
                                }
                            ]}
                            handleItemCLick={()=> {}}
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