import { FC, useState } from "react";
import TextInput from "../../../TextInput/TextInput";
import { StatusPopupOptions } from "../../TextEditor";

const Status: FC<{onInput: (entity: any)=> void; options?: StatusPopupOptions}> = (props) =>{
    const [value, setValue] = useState((props.options?.label || '').toUpperCase());
    return (
        <div className="shadow-sm py-1">
            <TextInput 
                label={"Status"} 
                hideLabel
                value={value} 
                handleChange={(value)=> setValue(value.toUpperCase())}
                onKeyEvent={(e)=>{
                    if (e.key === 'Enter'){
                        props.onInput({
                            mode: 'edit',
                            entityKey: props.options?.entityKey, 
                            data: {
                                label: value || 'STATUS',
                            }
                        })
                    }
                }}
            />
        </div>
    )
}

export default Status;