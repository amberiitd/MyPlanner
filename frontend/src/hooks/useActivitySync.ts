import { uniqueId } from "lodash";
import moment from "moment";
import { useContext, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addIssueaddFieldUpdate, updateIssueComment } from "../app/slices/issueSlice";
import { AuthContext } from "../components/route/AuthGuardRoute";
import { CrudPayload, IssueFieldUpdateActivity, Project } from "../model/types";
import { ProjectBoardContext } from "../pages/Projects/ProjectBoard/ProjectBoard";
import { projectCommonChildCrud } from "../services/api";
import { useQuery } from "./useQuery";

export const useActivitySync = (issueId: any) =>{
    const { openProject } = useContext(ProjectBoardContext);
    const projectCommonChildQuery = useQuery((payload: CrudPayload) => projectCommonChildCrud(payload));
    const dispatch = useDispatch();
    const {authUser} = useContext(AuthContext);
    const user = useMemo(()=> ({
        fullName: (authUser.data.attributes['custom:fullName'] || '') as string,
        email: (authUser.data.attributes.email || '') as string
    }), [ authUser]);

    const handleFieldUpdateSync =(data: {type: string; from: string; to: string;}) => {
        const newActivity: IssueFieldUpdateActivity = {
            id : uniqueId(),
            timestamp: moment().unix(),
            ...data,
            userId: user.email
        }
        projectCommonChildQuery.trigger({
            action: 'CREATE',
            data:{
                projectId: openProject?.id,
                parentId: issueId,
                parentItemType: 'issue',
                itemType: 'fieldUpdates',
                ...newActivity
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(addIssueaddFieldUpdate({
                id: issueId , 
                data: newActivity
            }))
        })
    }

    return {handleFieldUpdateSync}
}