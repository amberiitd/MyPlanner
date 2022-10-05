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

export interface SimpleAction{
    label: string;
    value: string;
}

export interface CrudPayload{
    itemType: 'project';
    action: 'CREATE' | 'RETRIEVE' | 'UPDATE' | 'DELETE';
    data: any;
}