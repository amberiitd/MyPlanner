import { FC } from 'react';
import BinaryAction from '../../../components/BinaryAction/BinaryAction';
import BreadCrumb from '../../../components/BreadCrumb/BreadCrumb';
import Button from '../../../components/Button/Button';
import DropdownAction from '../../../components/DropdownAction/DropdownAction';
import TextInput from '../../../components/input/TextInput/TextInput';
import MenuCard from '../../../components/MenuCard/MenuCard';
import ScrumBoard from '../../../components/ScrumBoard/ScrumBoard';
import TicketCard from '../../../components/ScrumBoard/TicketCard/TicketCard';
import TicketStage from '../../../components/ScrumBoard/TicketStage/TicketStage';
import './ProjectBoard.css';

interface ProjectBoardProps{

}

const ProjectBoard: FC<ProjectBoardProps> = (props) => {

    const breadCrumbLinks = {
        label: 'Projects',
        value: 'projects',
        children: [
            {
                label: 'Test Project 1',
                value: 'prohect-1',
                children: [
                    {
                        label: 'Board',
                        value: 'board',
                        children: []
                    }
                ]
            }
        ]
    };

    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];

    return (
        <div className='h-100'>
            <div className='d-flex flex-nowrap h-100'>
                <div className='sidebar p-2'>
                    <div>
                        <MenuCard 
                            label='PLANNING'
                            menuItems={[
                                {
                                    label: 'Backlog',
                                    value: 'backlog'
                                },
                                {
                                    label: 'Board',
                                    value: 'board'
                                }
                            ]} 
                            handleClick={()=>{}}
                            collapsable={true}
                            showLabel={true}
                            itemClass='option-hover-thm'
                            itemType='option-quote-sm'
                            selectedItem={{
                                label: 'Backlog',
                                value: 'backlog'
                            }}
                        />
                    </div>
                </div>
                <div className='px-5 py-3 board-body w-100 border'>
                    <div>
                        <BreadCrumb 
                            itemTree={breadCrumbLinks}
                            selectedItem={breadCrumbLinks.children[0].children[0]}
                            handleClick={()=>{}}
                        />
                    </div>
                    <div className='d-flex flex-nowrap align-items-center mb-3'>
                        <div className='h3'>
                            {'Proj1 Sprint 1'}
                        </div>
                        <div className='ms-auto me-2'>
                            <BinaryAction 
                                label='Star' 
                                bsIcon0='star'
                                bsIcon1='star-fill' 
                                extraClasses='icon-lg'
                                handleClick={()=>{}} 
                            />
                        </div>
                        <div className='me-2'>
                            <Button 
                                label='Complete sprint' 
                                extraClasses='btn-as-thm px-3 py-1'
                                handleClick={()=>{}}
                            />
                        </div>
                        <div>
                            <DropdownAction 
                                menuItems={[
                                    {
                                        label: 'Edit Sprint',
                                        value: 'edit-sprint'
                                    },
                                    {
                                        label: 'Manage custom filters',
                                        value: 'manage-filters'
                                    }
                                ]}
                                bsIcon='three-dots'
                                handleItemClick={()=>{}}
                            />
                        </div>
                    </div>
                    <div className='d-flex flex-nowrap align-items-center mb-3'>
                        <div>
                            <TextInput 
                                label='Search Project' 
                                hideLabel={true}
                                value={''}
                                rightBsIcon='search'
                                placeholder='Search this board'
                                handleChange={()=>{}}
                            />
                        </div>
                        <div className='d-flex flex-nowrap'>
                            {
                                members.map((item, index)=>(
                                    <div className='mx-1'>
                                        <Button
                                            label={item.name.split(' ').map(w => w[0]).join('')}
                                            extraClasses='rounded-circle circle-1 btn-as-thm'
                                            handleClick={()=>{}}
                                        />
                                    </div>
                                ))
                            }
                            <div className='mx-1'>
                                <Button
                                    label='Add member'
                                    hideLabel={true}
                                    rightBsIcon='person-plus-fill'
                                    extraClasses='rounded-circle circle-1 btn-as-light'
                                    handleClick={()=>{}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='d-flex '>
                        <div>
                            <ScrumBoard
                            />
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectBoard;