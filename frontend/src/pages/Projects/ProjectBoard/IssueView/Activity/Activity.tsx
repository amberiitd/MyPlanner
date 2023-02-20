import { startCase, uniqueId } from 'lodash';
import moment from 'moment';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addIssueComment, deleteIssueComment, updateIssueComment } from '../../../../../app/slices/issueSlice';
import { RootState } from '../../../../../app/store';
import ButtonCircle from '../../../../../components/ButtonCircle/ButtonCircle';
import ButtonSelect from '../../../../../components/input/ButtonSelect/ButtonSelect';
import TextEditor from '../../../../../components/input/TextEditor/TextEditor';
import { AuthContext } from '../../../../../components/route/AuthGuardRoute';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, IssueComment, IssueFieldUpdateActivity, ItemType, SimpleAction, User } from '../../../../../model/types';
import { commonChildCrud, projectCommonChildCrud } from '../../../../../services/api';
import { ProjectBoardContext } from '../../ProjectBoard';
import { IssueMainViewContext } from '../IssueMainView/IssueMainView';
import { IssueViewContext } from '../IssueView';
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
                    (selectedActivity.value === 'comments')  && 
                    <div className='mt-3'>
                        <CommentSection />
                    </div>
                }
            </div>
            <div>
                {
                    (selectedActivity.value === 'history' || selectedActivity.value === 'all')  && 
                    <div className='mt-3'>
                        <History filter={selectedActivity.value}/>
                    </div>
                }
            </div>
        </div>
    )
}

const CommentSection: FC = () => {
    const {authUser} = useContext(AuthContext);
    const user = useMemo(()=> ({
        fullName: (authUser.data.attributes['custom:fullName'] || '') as string,
        email: (authUser.data.attributes.email || '') as string
    }), [ authUser]);
    const users = useSelector((state: RootState) => state.users.values);
    const {openProject} = useContext(ProjectBoardContext);
    const {newCommentEditor, setNewCommentEditor} = useContext(IssueViewContext);
    const {openIssue} = useContext(IssueMainViewContext);
    const projectCommonChildQuery = useQuery((payload: CrudPayload) => projectCommonChildCrud(payload));
    const dispatch = useDispatch();
    const commentListRef = useRef<HTMLDivElement>(null);
    const handleEdit =(idx: number, value: string) => {
        if (!openIssue) return;
        projectCommonChildQuery.trigger({
            action: 'UPDATE',
            data: {
                projectId: openProject?.id,
                parentId: openIssue?.id,
                childCurrentIndex: idx,
                description: value,
                edited: true,
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
                        description: value,
                        edited: true
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
                user={user}
                element={(
                    <TextEditor 
                        open={newCommentEditor}
                        onToggle={(open: boolean)=> setNewCommentEditor(open)}
                        onSave={(value: string) => {
                            if (!openIssue) return;
                            const newComment: IssueComment= {
                                id: uniqueId(),
                                type: 'comment-new',
                                description: value,
                                userId: user.email,
                                timestamp: moment().unix()
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
                                setTimeout(()=> commentListRef.current?.scrollIntoView(), 500);
                            })
                        }}
                    />
                )}
            />
            <div ref={commentListRef} className='mt-3'>
                {
                    (openIssue?.comments || []).map((comm , idx)=> (
                        <div key={`comment-${idx}`} className='pt-2'>
                            <UserTagged
                                user={users.find(u => u.email === comm.userId)}
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
        </div>
    )
}

const Comment: FC<{
    comment: IssueComment, 
    currentIndex: number;
    onEdit: (idx: number, value: string)=> void;
    onDelete: (id: number)=> void;
}> = (props) => {
    const {commentOnEdit, setCommentOnEdit} = useContext(IssueViewContext);
    const users = useSelector((state: RootState) => state.users.values);
    return (
        <div>
            <div>
                <span className='fw-645'>{users.find(u => u.email === props.comment.userId)?.fullName || 'Unknown'}</span>
                <span className='ms-2 text-muted f-90'>{props.comment.timestamp ? moment.unix(props.comment.timestamp).format('MMM DD YYYY HH:mm'): ''}</span>
                {props.comment.edited && <span className='ms-2 text-muted f-90'>Edited</span>}
            </div>
            <div className='mt-1'>
                <TextEditor 
                    open={commentOnEdit === props.comment.id}
                    bannerClassName='bg-light px-2'
                    value={props.comment.id ? {id: props.comment.id, state: props.comment.description} : undefined}
                    onToggle={(open: boolean)=> setCommentOnEdit(open? props.comment.id: undefined)}
                    onSave={(value: string)=> props.onEdit(props.currentIndex, value)}
                />
            </div>
            <div className='d-flex mt-1'>
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

const History: FC<{filter: string}> = ({filter}) =>{
    const {openIssue} = useContext(IssueMainViewContext);
    const users = useSelector((state: RootState) => state.users.values);
    return (
        <div>
            {
                (filter === 'all' ? (openIssue?.fieldUpdates || []).concat(openIssue?.comments || []): (openIssue?.fieldUpdates || [])).map((update, index) =>{
                    const user = users.find(u => u.email === update.userId);
                    return (
                        <div className='mt-4' key={`activity-history-${index}`}>
                            <UserTagged 
                                user = {user}
                                element={
                                    <FieldUpdateActivity {...update} user={user}/>
                                }
                            />
                        </div>
                        
                    )
                })
            }
        </div>
    )
}

const FieldUpdateActivity: FC<IssueFieldUpdateActivity & {user?: User}> = (props) =>{
    return (
        <div className=''>
            <div>
                <span className='fw-645'>{props.user?.fullName || 'Unknown'}</span>
                <span className='ms-1'>{props.type.split('-')[0] === 'stage' ? 'changed': 'updated'} the</span>
                <span className='fw-645 ms-1'>{startCase(props.type.split('-')[0])}</span>
                <span className='ms-2 text-muted f-90 ms-1'>{props.timestamp ? moment.unix(props.timestamp).format('MMM DD YYYY HH:mm'): ''}</span>
            </div>
            {
                props.to &&
                <div>
                    <span>{props.from || 'None'}</span>
                    <i className='bi bi-arrow-right ms-1'></i>
                    <span className='ms-1'>{props.to}</span>
                </div>
            }
        </div>
        
    )
} 

const UserTagged: FC<{user?: User; element: JSX.Element}> = (props) => {
    return (
        <div className='d-flex flex-nowrap '>
            <div className='px-2'>
                <ButtonCircle
                    label={(props.user?.fullName || '').split(' ').map(p => p[0]).join('') || 'P'}
                    showLabel
                    bsIcon={'person-fill'}
                    size='md-1'
                    disabled
                    onClick={()=>{}}
                />
            </div>
            <div className='w-100'>
                {props.element}
            </div>
        </div>
    )
}

export default Activity;