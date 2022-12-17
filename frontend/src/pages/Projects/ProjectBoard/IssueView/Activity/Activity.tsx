import { uniqueId } from 'lodash';
import { FC, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addIssueComment, deleteIssueComment, updateIssueComment } from '../../../../../app/slices/issueSlice';
import ButtonSelect from '../../../../../components/input/ButtonSelect/ButtonSelect';
import TextEditor from '../../../../../components/input/TextEditor/TextEditor';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, IssueComment, ItemType, SimpleAction } from '../../../../../model/types';
import { commonChildCrud, projectCommonChildCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueMainViewContext } from '../IssueMainView/IssueMainView';
import './Activity.css';

interface ActivityProps{

}

const Activity: FC<ActivityProps> = (props) => {
    const activityOptions: SimpleAction[] = [
        {
            label: 'All',
            value: 'all'
        },
        {
            label: 'Comments',
            value: 'comments',
        },
        {
            label: 'History',
            value: 'history'
        }
    ]
    const [selectedActivity, setSelectedActivity] = useState(activityOptions[1]);

    return (
        <div className=''>
            <h6>Activity</h6>
            <div className='d-flex flex-nowrap mt-2'>
                <div className='py-1'>
                    Show: 
                </div>
                <div className='w-75 mx-2'>
                    <ButtonSelect 
                        items={activityOptions} 
                        currentSelection={selectedActivity}
                        // resizeProps={[boardSizes, issueViewSizes]}
                        onToggle={(item) => {setSelectedActivity(item)}}
                    />
                </div>
            </div>
            <div>
                {
                    (selectedActivity.value === 'comments' || selectedActivity.value)  && 
                    <div className='mt-3'>
                        <CommentSection />
                    </div>
                }
            </div>
        </div>
    )
}

const CommentSection: FC = () => {
    const {openProject} = useContext(ProjectBoardContext);
    const {newCommentEditor, setNewCommentEditor, openIssue} = useContext(IssueMainViewContext);
    const projectCommonChildQuery = useQuery((payload: CrudPayload) => projectCommonChildCrud(payload));
    const dispatch = useDispatch();
    const [newCommentValue, setNewCommentValue] = useState<string | undefined>(undefined);
    const handleEdit =(idx: number, value: string) => {
        if (!openIssue) return;
        projectCommonChildQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                parentId: openIssue?.id,
                childCurrentIndex: idx,
                description: value,
                itemType: 'comments'
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(updateIssueComment({
                id: openIssue.id , 
                data: {
                    currentIndex: idx,
                    updateData: {
                        description: value
                    }
                }
            }))
        })
    }

    const handleDelete = (idx: number) => {
        if (!openIssue) return;
        projectCommonChildQuery.trigger({
            action: 'DELETE',
            data: {
                projectId: openProject?.id,
                parentId: openIssue?.id,
                childCurrentIndex: idx,
                itemType: 'comments'
            },
            itemType: 'issue'
        } as CrudPayload)
        .then(()=>{
            dispatch(deleteIssueComment({
                id: openIssue.id , 
                data: {
                    currentIndex: idx
                }
            }))
        })
    }
    
    return (
        <div className=''>
            <UserTagged 
                element={(
                    <TextEditor 
                        open={newCommentEditor}
                        value={newCommentValue}
                        onToggle={(open: boolean)=> setNewCommentEditor(open)}
                        onSave={(value: string) => {
                            if (!openIssue) return;
                            const newComment: IssueComment= {
                                id: uniqueId(),
                                description: value
                            }
                            const parentItemType: ItemType = 'issue';
                            projectCommonChildQuery.trigger({
                                action: 'CREATE',
                                data:{
                                    projectId: openProject?.id,
                                    parentId: openIssue.id,
                                    parentItemType,
                                    itemType: 'comments',
                                    ...newComment
                                },
                                itemType: 'issue'
                            } as CrudPayload)
                            .then(()=>{
                                dispatch(addIssueComment({id: openIssue.id, data: newComment}));
                                setNewCommentValue(undefined)
                            })
                        }}
                    />
                )}
            />
            {
                (openIssue?.comments || []).map((comm , idx)=> (
                    <div key={uniqueId()} className='my-3'>
                        <UserTagged
                            element={(
                                <Comment 
                                    currentIndex={idx}
                                    comment={comm}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            )}
                        />
                    </div>
                    
                ))
            }
        </div>
    )
}

const Comment: FC<{
    comment: IssueComment, 
    currentIndex: number;
    onEdit: (idx: number, value: string)=> void;
    onDelete: (id: number)=> void;
}> = (props) => {
    const {commentOnEdit, setCommentOnEdit} = useContext(IssueMainViewContext);
    return (
        <div>
            <div>

            </div>
            <div>
                <TextEditor 
                    open={commentOnEdit === props.comment.id}
                    bannerClassName='bg-light px-2'
                    value={props.comment.description}
                    onToggle={(open: boolean)=> setCommentOnEdit(open? props.comment.id: undefined)}
                    onSave={(value: string)=> props.onEdit(props.currentIndex, value)}
                />
            </div>
            <div className='d-flex px-2 pt-3'>
                <div className='cursor-pointer text-muted hover-underline'
                    onClick={()=>{
                        props.onDelete(props.currentIndex)
                    }}
                >
                    Delete
                </div>
            </div>
        </div>
    )
}

const UserTagged: FC<{element: JSX.Element}> = (props) => {
    return (
        <div className='d-flex flex-nowrap '>
            <div className='px-2'>
                <button className='p-2 rounded-circle bg-thm-2 text-white' style={{width: '2.5em', height: '2.5em'}}>
                    NA
                </button>
            </div>
            <div className='w-100'>
                {props.element}
            </div>
        </div>
    )
}

export default Activity;