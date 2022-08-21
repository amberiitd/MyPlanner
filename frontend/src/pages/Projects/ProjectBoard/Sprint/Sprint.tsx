import { FC } from 'react';
import BinaryAction from '../../../../components/BinaryAction/BinaryAction';
import Button from '../../../../components/Button/Button';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import MultiSelect from '../../../../components/input/MultiSelect/MultiSelect';
import TextInput from '../../../../components/input/TextInput/TextInput';
import ScrumBoard from '../../../../components/ScrumBoard/ScrumBoard';
import './Sprint.css';

interface SprintProps{

}

const Sprint: FC<SprintProps> = (props) => {
    const members = [
        {
            name: 'Nazish Amber'
        },
        {
            name: 'Khalid Safi'
        }
    ];
    return (
        <div>
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
                        actionCategory={[
                            {
                                label: 'Action',
                                items: [
                                    {
                                        label: 'Edit Sprint',
                                        value: 'edit-sprint'
                                    },
                                    {
                                        label: 'Manage custom filters',
                                        value: 'manage-filters'
                                    }
                                ]
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}
                    />
                </div>
            </div>
            <div className='d-flex flex-nowrap align-items-center mb-3'>
                <div className='me-2'>
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
                    <div className='mx-2'>
                        <Button
                            label='Add member'
                            hideLabel={true}
                            rightBsIcon='person-plus-fill'
                            extraClasses='rounded-circle circle-1 btn-as-light'
                            handleClick={()=>{}}
                        />
                    </div>
                    <div className='filter mx-2'>
                        <MultiSelect 
                            label='Issue Type'
                            data={[
                                {
                                    label: 'Type',
                                    items: [
                                        {
                                            label: 'Bug',
                                            value: 'bug'
                                        },
                                        {
                                            label: 'Story',
                                            value: 'story'
                                        }
                                    ],
                                    showLabel: false
                                }
                            ]} 
                            hideLabel={true}
                            onSelectionChange={()=>{}}
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
    )
}

export default Sprint;