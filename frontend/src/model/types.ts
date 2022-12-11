import { Duration } from "../pages/Projects/ProjectBoard/Backlog/SprintModal/SprintModal";

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

export const EMPTY_PROJECT: Project = {
    id: '',
    name: '',
    key: '',
    managementType: '',
    templateType: '',
    template: ''
}

export type SprintStatus = 'complete' | 'active' | 'not-started';
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

export const EMPTY_SPRINT: Sprint = {
    id: '',
    name: '',
    projectKey: '',
    index: 0,
    status: 'not-started'
}

export interface IssueComment{
    id: string;
    description: string;
}

export interface SimpleAction{
    htmlId?: string;
    label: string;
    value: string;
}
export type ISSUE_ACTION = 'ASSIGN_SPRINT';
export type ItemType  = 'project' | 'sprint' | 'issue';
export interface CrudPayload{
    itemType: ItemType;
    action: 'CREATE' | 'RETRIEVE' | 'UPDATE' | 'DELETE' | ISSUE_ACTION;
    data: any;
}
