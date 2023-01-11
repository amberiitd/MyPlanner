import { stageMap } from "../pages/Projects/ProjectBoard/Backlog/IssueRibbon/StageSelector/stages";
import { Duration } from "../pages/Projects/ProjectBoard/Backlog/SprintModal/SprintModal";
import { Field } from "../pages/Projects/ProjectBoard/IssueView/SideView/FieldCard/FieldCard";


export interface IssueStage{
    label: string;
    value: string;
    issueOrder?: string[];
}

export interface ScrumBoard{
    stages: IssueStage[];
    stageOrder?: string[];
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
    backlogIssueOrder?: string[];
    scrumBoard: ScrumBoard
}

export const EMPTY_PROJECT: Project = {
    id: '',
    name: '',
    key: '',
    managementType: '',
    templateType: '',
    template: '',
    backlogIssueOrder: [],
    scrumBoard: {
        stages: Object.values(stageMap),
        stageOrder: []
    }
}

export type SprintStatus = 'complete' | 'active' | 'not-started';
export interface Sprint{
    id: string;
    projectKey: string;
    sprintName: string;
    index: number;
    sprintStatus: SprintStatus;
    startTimestamp?: number;
    endTimestamp?: number;
    sprintDuration?: Duration | 'custom';
    goal?: string;
    issueOrder?: string[];
}

export const EMPTY_SPRINT: Sprint = {
    id: '',
    sprintName: '',
    projectKey: '',
    index: 0,
    sprintStatus: 'not-started',
    issueOrder: []
}

export interface IssueComment{
    id: string;
    description: string;
}

export interface SimpleAction{
    htmlId?: string;
    label: string;
    value: string;
    leftBsIcon?: string;
}
export type ISSUE_ACTION = 'ASSIGN_SPRINT';
export type ItemType  = 'project' | 'sprint' | 'issue' | 'userPref' | 'user';
export interface CrudPayload{
    itemType: ItemType;
    action: 'CREATE' | 'RETRIEVE' | 'UPDATE' | 'DELETE' | ISSUE_ACTION;
    data: any;
}

export interface UserPref{
    id: string | 'default';
    projectId?: string;
    recentViewedBoards?: string[];
    recentViewedIssues?: string[];
    recentViewedProjects?: string[];
    recentWorkedBoards?: string[];
    recentWorkedIssues?: string[];
    recentWorkedProjects?: string[];
    issueFields?: Field[];
}

export const EMPTY_USER_PREF: UserPref = {
    id: 'default',
    recentViewedBoards: [],
    recentViewedIssues: [],
    recentViewedProjects: [],
    recentWorkedBoards: [],
    recentWorkedIssues: [],
    recentWorkedProjects: []
}

export interface User{
    email: string;
    fullName: string;
}

export const linkedIssueCategories = ['isBlokedBy', 'blocks', 'relatedTo'];