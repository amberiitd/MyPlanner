import { FC, useContext, useState } from 'react';
import { Modal } from 'react-bootstrap';
import Button from '../../../../components/Button/Button';
import ButtonCircle from '../../../../components/ButtonCircle/ButtonCircle';
import PeopleSearchSelect from '../../../../components/PeopleSearchSelect/PeopleSearchSelect';
import { useQuery } from '../../../../hooks/useQuery';
import { User } from '../../../../model/types';
import { inviteToProject } from '../../../../services/api';
import { ProjectBoardContext } from '../ProjectBoard';
import './InvitePeople.css';

interface InvitePeopleProps{

}

const InvitePeople: FC<InvitePeopleProps> = (props) => {
    const { openProject } = useContext(ProjectBoardContext);
    const [people, setPeople] = useState<User[]>([]);
    const [modal, setModal] = useState(false);
    const inviteQuery = useQuery<{
        projectId: string; 
        inviteEmails: string[];
    }>((payload)=> inviteToProject(payload))
    return (
        <div>
            {/* <Button
                label='Add member'
                hideLabel={true}
                rightBsIcon='person-plus-fill'
                extraClasses='rounded-circle circle-1 btn-as-light'
                handleClick={()=>{setModal(true)}}
            /> */}
            <ButtonCircle 
                label='Add People'
                showLabel={false}
                bsIcon={'person-plus-fill'}
                onClick={()=>setModal(true)}
                extraClasses="btn-as-light"
                size='md'
            />
            <Modal className='p-2'
                show={modal}
            >
                <Modal.Header >
                    <div className='d-flex'>
                        <div className='h5'>
                            Add
                        </div>
                    </div>
                </Modal.Header>
                <Modal.Body className='py-2'>
                    <div>
                        <PeopleSearchSelect 
                            onSelectionChange={(people)=> {setPeople(people)}}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer className='py-3'>
                    <div className='d-flex flex-nowrap'>
                        <div className='ms-auto me-2'>
                            <Button 
                                label='Cancel'
                                extraClasses='btn-as-light py-1 px-1'
                                handleClick={()=> {setModal(false)}}
                            />
                        </div>
                        <div>
                            <Button 
                                label='Add'
                                handleClick={()=>{
                                    inviteQuery.trigger({
                                        projectId: openProject?.id || '',
                                        inviteEmails: people.map(p => p.email)
                                    })
                                    .then(res =>{
                                        setModal(false)
                                    })
                                }}
                            />
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>

        </div>
    )
}

export default InvitePeople;