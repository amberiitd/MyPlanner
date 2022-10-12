import { SimpleAction } from "../../../../../../model/types"

export type StageValue = 'in-progress' | 'not-started' | 'done'

export interface Stage extends SimpleAction{
    value: StageValue;
}

export const IN_PROGRESS: Stage = {
    label: 'IN PROGRESS',
    value: 'in-progress',
}

export const NOT_STARTED: Stage = {
    label: 'NOT STARTED',
    value: 'not-started',
}

export const DONE: Stage ={
    label: 'DONE',
    value: 'done'
}

export const stages = [IN_PROGRESS, NOT_STARTED, DONE];
export const stageMap: {
    [key: string]: Stage
} ={
    'done': DONE,
    'not-started': NOT_STARTED,
    'in-progress': IN_PROGRESS
}