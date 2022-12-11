import { FC, useState } from "react"
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { updateIssue } from "../../../../../../app/slices/issueSlice";
import { updateFields } from "../../../../../../app/slices/userPrefSlice";
import { RootState } from "../../../../../../app/store";
import NumberInput from "../../../../../../components/input/NumberInput/NumberInput";
import Select from "../../../../../../components/input/Select/Select";
import NumberBadge from "../../../../../../components/NumberBadge/NumberBadge";
import { useQuery } from "../../../../../../hooks/useQuery";
import { CrudPayload } from "../../../../../../model/types";
import { commonCrud } from "../../../../../../services/api";
import { FieldInputProps } from "./FieldCard"


export const SprintField: FC<FieldInputProps> = (props) => {

    const NONE = {
        label: 'None',
        value: 'none',
    }
    const sprints = useSelector((state: RootState) => state.sprints);

    const data= [
        {
            label: '',
            items: [
                ...(sprints.values.map(sprint => ({label: sprint.name, value: sprint.id}))),
                NONE
            ]
        },
    ];

    const dispatch = useDispatch();
    const [showAction, setShowAction] = useState(false);
    return (
        <div className="d-flex justify border w-100">
            <div className="py-2" style={{width: '33%'}}
                onMouseOver={(e)=> setShowAction(true)}
                onMouseOut={(e)=> setShowAction(false)}
            >
                <span>Sprint</span>
                {
                    showAction &&
                    <span className="cursor-pointer ms-1" onClick={(e) => {
                        dispatch(updateFields({
                            id: props.id, 
                            data: {
                                fieldCardId: props.fieldCardId === 'pinned'? 'details': 'pinned'
                            }
                        }));
                    }}>
                        <i className="bi bi-pin-angle-fill" hidden={props.fieldCardId !== 'pinned'}></i>
                        <i className="bi bi-pin-angle" hidden={props.fieldCardId === 'pinned'}></i>
                    </span>
                }
            </div>
            <div className="ms-3" style={{width: '67%'}}>
                <Select 
                    label='Sprint'
                    hideLabel={true}
                    data={data}
                    selectedItem={data[0].items.find(item => item.value === props.value) || NONE}
                    hideToggleIcon={true}
                    extraClasses='bg-as-light-hover'
                    onSelectionChange={(item: any)=>{
                        (props.onEdit || (()=>{}))(item)
                    }}
                />
            </div>
        </div>
    )
}

export const StoryPointField: FC<FieldInputProps> = (props) => {

    const dispatch = useDispatch();
    const [showAction, setShowAction] = useState(false);
    const issueQuery = useQuery((payload: CrudPayload)=> commonCrud(payload));
    return (
        <div className="d-flex justify border w-100 align-items-center">
            <div className="" style={{width: '33%'}}
                onMouseOver={(e)=> setShowAction(true)}
                onMouseOut={(e)=> setShowAction(false)}
            >
                <span>Story point estimate</span>
                {
                    showAction &&
                    <span className="cursor-pointer ms-1" onClick={(e) => {
                        dispatch(updateFields({
                            id: props.id, 
                            data: {
                                fieldCardId: props.fieldCardId === 'pinned'? 'details': 'pinned'
                            }
                        }));
                    }}>
                        <i className="bi bi-pin-angle-fill" hidden={props.fieldCardId !== 'pinned'}></i>
                        <i className="bi bi-pin-angle" hidden={props.fieldCardId === 'pinned'}></i>
                    </span>
                }
            </div>
            <div className="ms-3" style={{width: '67%'}}>
                {/* <NumberInput 
                    label={""}
                    hideLabel={true} 
                    value={props.value as number} 
                    handleChange={()=>{}}
                /> */}

                <NumberBadge
                    data={props.value as number}
                    extraClasses='bg-light'
                    onValueChange={(value) => {
                        (props.onEdit || (()=>{}))(value)
                    }}
                />
            </div>
        </div>
    )
}
