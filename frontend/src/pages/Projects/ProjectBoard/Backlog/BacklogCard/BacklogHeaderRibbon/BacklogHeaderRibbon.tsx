import { FC } from 'react';
import Badge from '../../../../../../components/Badge/Badge';
import Button from '../../../../../../components/Button/Button';
import './BacklogHeaderRibbon.css';

interface BacklogHeaderRibbonProps{
    label: string;
    metric: {storyPoints: { stageLabel: string; value: number; color?: string;}[];};
    collapse: boolean;
    handleClick: () => void;
}

const BacklogHeaderRibbon: FC<BacklogHeaderRibbonProps> =(props) => {
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
                        label='Create sprint'
                        handleClick={()=>{}}
                    />
                </div>
            </div>
        </div>
    )
}

export default BacklogHeaderRibbon;