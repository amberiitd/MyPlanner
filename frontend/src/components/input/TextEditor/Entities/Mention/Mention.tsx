import { FC } from 'react';
import LinkCard from '../../../../LinkCard/LinkCard';
import './Mention.css';

interface MentionProps{
    onSelect: (entity: any) => void;
}

const Mention: FC<MentionProps> = (props) => {

    return (
        <div className='rounded p-3 bg-white shadow-sm border' style={{opacity: 1, borderColor: 'whitesmoke'}}>
            <LinkCard 
                label={'People'} 
                showLabel={false} 
                isLoading={false} 
                linkItems={[
                    {
                        label: 'Nazish Amber',
                        value: 'amberiitd'
                    },
                    {
                        label: 'Khalid Safi',
                        value: 'safi001'
                    }
                ]} 
                handleClick={(event) => {
                    props.onSelect({
                        type: 'MENTION',
                        mutability: 'IMMUTABLE',
                        data: {
                            label: '@'+ event.label,
                            id: event.value
                        }
                    })
                }}
            />
        </div>
    )
}

export default Mention;