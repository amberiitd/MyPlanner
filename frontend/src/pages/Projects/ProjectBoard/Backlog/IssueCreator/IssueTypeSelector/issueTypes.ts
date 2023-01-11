import { SimpleAction } from "../../../../../../model/types";

export type IssueTypeValue = 'story' | 'task' | 'bug' | 'child';
export interface IssueType extends SimpleAction{
    value: IssueTypeValue;
    leftBsIcon: string;
}
export const STORY: IssueType = {
    label: 'Story',
    value: 'story',
    leftBsIcon: 'bookmark'
};

export const TASK: IssueType = {
    label: 'Task',
    value: 'task',
    leftBsIcon: 'bookmark-check'
};

export const BUG: IssueType = {
    label: 'Bug',
    value: 'bug',
    leftBsIcon: 'bookmark-x'
};

export const CHILD: IssueType = {
    label: 'Child',
    value: 'child',
    leftBsIcon: 'diagram-2'
};

export const issueTypes = [STORY, TASK, BUG];

export const issueTypeMap: {
    [key: string]: any
} = {
    'story': STORY,
    'task': TASK,
    'bug': BUG,
    'child': CHILD
}