export const STORY = {
    label: 'Story',
    value: 'story',
    leftBsIcon: 'bookmark'
};

export const TASK = {
    label: 'Task',
    value: 'task',
    leftBsIcon: 'bookmark-check'
};

export const BUG = {
    label: 'Bug',
    value: 'bug',
    leftBsIcon: 'bookmark-x'
};

export const issueTypes = [STORY, TASK, BUG];

export const issueTypeMap: {
    [key: string]: any
} = {
    'story': STORY,
    'task': TASK,
    'bug': BUG
}