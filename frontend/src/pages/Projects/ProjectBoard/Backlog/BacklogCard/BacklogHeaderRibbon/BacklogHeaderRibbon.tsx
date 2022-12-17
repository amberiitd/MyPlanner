import { max, uniqueId } from 'lodash';
import { FC, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addSprint } from '../../../../../../app/slices/sprintSlice';
import { RootState } from '../../../../../../app/store';
import Badge from '../../../../../../components/Badge/Badge';
import Button from '../../../../../../components/Button/Button';
import { useQuery } from '../../../../../../hooks/useQuery';
import { CrudPayload, EMPTY_PROJECT, EMPTY_SPRINT, Project } from '../../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../../services/api';
import { ProjectBoardContext } from '../../../ProjectBoard';
import './BacklogHeaderRibbon.css';

interface BacklogHeaderRibbonProps{
    label: string;
    metric: {storyPoints: { stageLabel: string; value: number; color?: string;}[]; issueCount: number};
    collapse: boolean;
    handleClick: () => void;
    project: Project;
}

const BacklogHeaderRibbon: FC<BacklogHeaderRibbonProps> =(props) => {
    const dispatch = useDispatch();
    const sprints = useSelector((state: RootState) => state.sprints);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const {openProject} = useContext(ProjectBoardContext);
    const createSprint = useCallback(() => {
        const index = sprints.values
            .filter(sprint => sprint.projectKey === props.project.key)
            .reduce((pre: number, cur)=> {
                return max([pre, cur.index]) || 0
            }, 0) + 1;
        const newSprint = {
            ...EMPTY_SPRINT,
            id: uniqueId(),
            index,
            name: `Sprint ${index}`,
            projectKey: props.project.key
        }
        const payload: CrudPayload ={
            action: 'CREATE',
            data: {projectId: openProject?.id, ...newSprint},
            itemType: 'sprint'
        }
        projectCommonQuery.trigger(payload)
        .then(res => {
            dispatch(addSprint(newSprint));
        });
    }, [sprints, props]);
    return (
        <div className='d-flex flex-nowrap align-items-center w-100 px-1'>
            <div className='w-100 py-1' onClick={props.handleClick}>
                <i className='bi bi-chevron-right' hidden={!props.collapse}></i>
                <i className='bi bi-chevron-down' hidden={props.collapse}></i>
                <span className='mx-1'>{props.label}</span>
                <span className='mx-1 text-muted'>{`(${props.metric.issueCount} issues)`}</span>
            </div>
            <div className='d-flex flex-nowrap align-items-center ms-auto'>
                {
                    props.metric.storyPoints.map((item, index) => (
                        <div className='mx-1' key={`storypoint-badge-${index}`}>
                            <Badge
                                data={item.value}
                                extraClasses={`bg-${item.color?? 'light'}`}
                            />
                        </div>
                        
                    ))
                }
                <div className='mx-1'>
                    <Button
                        label='Create sprint'
                        handleClick={createSprint}
                    />
                </div>
            </div>
        </div>
    )
}

export default BacklogHeaderRibbon;