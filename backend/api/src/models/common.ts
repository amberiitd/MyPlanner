export type SprintStatus = 'complete' | 'active' | 'not-started';
export type StageValue = 'in-progress' | 'not-started' | 'done'

export interface Duration{
    label: string;
    unit: 'days';
    value: number;
}

export interface Project{
    id: string;
    name: string;
    key: string;
    managementType: string;
    templateType: string;
    template: string;
    leadAssignee?: string;
    isStarred?: boolean;
}

export interface Issue{
    id: string;
    type?: any;
    label?: string;
    projectKey?: any;
    sprintId?: string;
    storyPoint?: number;
    assignee?: any;
    stage?: StageValue;
}

export interface Sprint{
    id: string;
    projectKey: string;
    name: string;
    index: number;
    status: SprintStatus;
    startTimestamp?: number;
    endTimestamp?: number;
    duration?: Duration | 'custom';
    goal?: string;
}

export interface CrudRequest{
    uid: string;
    data:  Sprint & Project & {
        projectId: string;
        ids?: string[], 
        sprintId?: string;
        parentId: string;
        parentItemType?: string;
        itemType?: string;
        childCurrentIndex?: string;
        parentIssueId?: string;
        subPath?: string;
        deepData?: any;
    };
    itemType: string;
}

export const ItemType = {
    ISSUE: 'issue',
    PROJECT: 'project'
}

export interface HandlerResponse{
    statusCode: number,
    body: string;
}

export const RequestAction = {
    CREATE: 'CREATE',
    RETRIEVE: 'RETRIEVE',
    DELETE: 'DELETE',
    UPDATE: 'UPDATE',
    Issue: {
        ASSIGN_SPRINT: 'ASSIGN_SPRINT'
    }
}