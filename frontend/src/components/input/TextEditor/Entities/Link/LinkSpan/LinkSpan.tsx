import { ContentState } from 'draft-js';
import { FC } from 'react';
import './LinkSpan.css';

interface LinkSpanProps{

}

const LinkSpan: FC<any> = (props) => {
    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey)
    return (
        <span {...entity.getData()} className='text-primary'>
            {props.children}
        </span>
    )
}

export default LinkSpan;