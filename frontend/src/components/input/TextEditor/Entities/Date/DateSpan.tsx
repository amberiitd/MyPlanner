import { ContentState } from "draft-js";
import { FC, useContext } from "react"
import { TextEditorContext } from "../../TextEditor";

const DateSpan: FC<any> = (props) =>{
    const { setDatePopup } = useContext(TextEditorContext);
    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey)
    const entityData = entity.getData();
    return (
        <div {...props} className='border px-1 rounded bg-grey1 d-inline-block'
            contentEditable='false' 
            suppressContentEditableWarning
            onClick={()=>{
                setTimeout(()=>{
                    setDatePopup({show: true, options: {mode: 'edit', entityKey: props.entityKey, label: entityData.label, timestamp: entityData.timestamp}});
                }, 100)
            }}
        >
            {props.children}
        </div>
    )
}

export default DateSpan;