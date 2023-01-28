import { ContentState } from "draft-js";
import { FC, useContext } from "react";
import { TextEditorContext } from "../../TextEditor";

const StatusSpan: FC<any> = (props) => {
    const { setStatusPopup } = useContext(TextEditorContext);
    const contentState: ContentState = props.contentState;
    const entity = contentState.getEntity(props.entityKey)
    const entityData = entity.getData();
    return (
        <div {...props} className="rounded border border-primary bg-light px-1 d-inline-block"
            contentEditable='false' 
            suppressContentEditableWarning
            onClick={()=>{
                setTimeout(()=>{
                    setStatusPopup({show: true, options: {mode: 'edit', entityKey: props.entityKey, label: entityData.label, color: entityData.color}});
                }, 100)
            }}
        >
            {props.children}
        </div>
    )
}

export default StatusSpan;