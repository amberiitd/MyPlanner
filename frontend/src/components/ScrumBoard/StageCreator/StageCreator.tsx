import { toLower, uniqueId } from "lodash";
import { FC, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProject } from "../../../app/slices/projectSlice";
import { useQuery } from "../../../hooks/useQuery";
import { CrudPayload } from "../../../model/types";
import { ProjectBoardContext } from "../../../pages/Projects/ProjectBoard/ProjectBoard";
import { commonChildCrud } from "../../../services/api";
import Button from "../../Button/Button";
import EditableText from "../../EditableText/EditableText";
import CircleRotate from "../../Loaders/CircleRotate";
import TicketStage from "../TicketStage/TicketStage";

interface StageCreatorProps{

}

const StageCreator: FC = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const dispatch = useDispatch();
    const [active, setActive] = useState(false);
    const commonChildQuery = useQuery((payload: CrudPayload) => commonChildCrud(payload));
    return (
        <div>
            {
                !active &&
                <div>
                    {
                        !commonChildQuery.loading &&
                        <Button 
                            label={'Add Stage'}
                            hideLabel={true}
                            rightBsIcon={'plus-lg'}
                            extraClasses='p-1 ps-2 btn-as-light fs-5'
                            handleClick={()=>{setActive(true)}} 
                        />
                    }{
                        commonChildQuery.loading &&
                        <div>
                            <CircleRotate loading={true}/>
                        </div>
                    }
                </div>
                
            }
            {
                active && 
                <div className='p-2 pb-3 bg-light rounded-3 ticket-stage overflow-auto'>
                    <div className='' style={{zIndex: 10}}>
                        <EditableText 
                            edit
                            value={``} 
                            onSave={(label)=>{
                                if (label?.length > 2){
                                    const value = uniqueId();
                                    const stages = [...(openProject?.scrumBoard.stages || []), {label, value}];
                                    commonChildQuery.trigger({
                                        action: 'CREATE',
                                        data: {
                                            parentId: openProject?.id,
                                            subPath: 'scrumBoard',
                                            label,
                                            value,
                                            issueOrder: [],
                                            itemType: 'stages'
                                        },
                                        itemType: 'project'
                                    } as CrudPayload)
                                    .then(()=>{
                                        dispatch(updateProject({key: openProject?.key || '', data: {
                                            scrumBoard: {
                                                stages,
                                                stageOrder: stages.map(stage => stage.value)
                                            }
                                        }}));
                                    });
                                }
                                setActive(false);
                            }}  
                            onCancel={()=> {
                                setActive(false);
                            }}                        
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default StageCreator;