import { FC } from 'react';
import Badge from '../../../../../../components/Badge/Badge';
import Button from '../../../../../../components/Button/Button';
import DropdownAction from '../../../../../../components/DropdownAction/DropdownAction';
import './SprintHeaderRibbon.css';

interface SprintHeaderRibbonProps{
    label: string;
    metric: {storyPoints: { stageLabel: string; value: number; color?: string;}[]; status: 'complete' | 'active' | 'not-started'};
    collapse: boolean;
    handleClick: () => void;
}

const SprintHeaderRibbon: FC<SprintHeaderRibbonProps> = (props) => {
    return (
        <div className='d-flex flex-nowrap align-items-center w-100 px-1'>
            <div className='w-100 py-1' onClick={props.handleClick}>
                <i className='bi bi-chevron-right' hidden={!props.collapse}></i>
                <i className='bi bi-chevron-down' hidden={props.collapse}></i>
                <span className='mx-1'>{props.label}</span>
            </div>
            <div className='d-flex flex-nowrap align-items-center ms-auto'>
                {
                    props.metric.storyPoints.map((item, index) => (
                        <div className='mx-1' key={`storypoint-badge-${index}`}>
                            <Badge
                                data={item.value}
                                extraClasses={`bg-${item.color?? 'light'}`}
                            />
                        </div>
                        
                    ))
                }
                <div className='mx-1'>
                    <Button
                        label={props.metric.status === 'active'? 'Complete sprint': props.metric.status=== 'not-started'? 'Start': 'Action'}
                        handleClick={()=>{}}
                    />
                </div>
                <div className='mx-1'>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Actions',
                                items:[

                                ]
                            }
                        ]} 
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}
                    />
                </div>
            </div>
        </div>
    )
}

export default SprintHeaderRibbon;