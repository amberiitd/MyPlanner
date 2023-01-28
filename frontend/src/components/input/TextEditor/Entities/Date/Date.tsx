import moment from "moment";
import { FC, useContext, useState } from "react"
import DateInput from "../../../DateInput/DateInput"
import { DatePopupOptions, TextEditorContext } from "../../TextEditor";

const DatePicker: FC<{onInput: (entity: any) =>void; options?: DatePopupOptions}> = (props) =>{
    const [value, setValue] = useState(props.options? props.options.timestamp : moment().unix())
    return (
        <div>
            <DateInput 
                label={""} 
                hideLabel
                value={value} 
                handleChange={(value)=>{
                    props.onInput({ 
                        mode: 'edit', 
                        entityKey: props.options?.entityKey, 
                        data: {
                            label: moment(value).format('YYYY-MM-DD'), 
                            timestamp: moment(value).unix()
                        }
                    })
                }}
            />
            {/* <input 
                className="w-100 me-2" 
                type="date" 
                placeholder={'Select date'}
            /> */}
        </div>
    )
} 

export default DatePicker;