import { createContext, FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import './../IssueView.css';
import DropdownAction from '../../../../../components/DropdownAction/DropdownAction';
import TextEditor from '../../../../../components/input/TextEditor/TextEditor';
import { ProjectBoardContext } from '../../ProjectBoard';
import Activity from './../Activity/Activity';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../app/store';
import { useQuery } from '../../../../../hooks/useQuery';
import { CrudPayload, SimpleAction } from '../../../../../model/types';
import { commonCrud, projectCommonCrud } from '../../../../../services/api';
import { useDispatch } from 'react-redux';
import { refreshIssue, updateIssue } from '../../../../../app/slices/issueSlice';
import { Issue } from '../../Backlog/IssueRibbon/IssueRibbon';
import CircleRotate from '../../../../../components/Loaders/CircleRotate';
import ChildIssue from './../ChildIssue/ChildIssue';
import { isEmpty } from 'lodash';
import { updateUserPref } from '../../../../../app/slices/userPrefSlice';
import { IssueViewContext } from '../IssueView';
import Button from '../../../../../components/Button/Button';
import ButtonActionGroup from '../../../../../components/ButtonActionGroup/ButtonActionGroup';
import LinkedIssue from '../LinkedIssue/LinkedIssue';
import WebLink from '../WebLink/WebLink';
import Attachment from '../Attachment/Attachment';

interface IssueMainViewProps{
    onRefresh: () => void;
    issue: Issue | undefined;
}
/* 
TO DO: IssueViewContext needs to be taken on step back in the tree, since the same props will be used in backlog board as well.
*/
const IssueMainView: FC<IssueMainViewProps> = (props) => {
    const {openProject} = useContext(ProjectBoardContext);
    const {openIssue, descEditor, setDescEditor} = useContext(IssueViewContext);
    const projectCommonQuery = useQuery((payload: CrudPayload) => projectCommonCrud(payload));
    const userPrefs = useSelector((state: RootState) => state.userPrefs);
    const defaultUserPrefs = useMemo(() => userPrefs.values.find(pref => pref.id === 'default'), [userPrefs]);
    const commonQuery = useQuery((payload: CrudPayload) => commonCrud(payload));
    const dispatch = useDispatch();
    const [addChild, setAddChild] = useState(false);
    const [linkIssue, setLinkIssue] = useState(false);
    const [webLink, setWebLink] = useState(false);
    const [attach, setAttach] = useState(false);
    const linkedIssueCount = useMemo(() =>{
        return Object.values(openIssue?.linkedIssues || {}).reduce((pre, cur) => pre+ cur.length, 0);
    }, [openIssue])

    useEffect(()=>{
        const newRecent = [...(defaultUserPrefs?.recentViewedIssues || [])];
        if (!isEmpty(props.issue?.id)){
            const index = newRecent.findIndex(p => p === props.issue?.id);
            if (index >= 0){
                newRecent.splice(index, 1);
            }
            newRecent.splice(0, 0, props.issue?.id || '');
            commonQuery.trigger({
                action: 'UPDATE',
                data: {
                    id: 'default',
                    recentViewedIssues: newRecent
                },
                itemType: 'userPref'
            } as CrudPayload)
            .then(() => {
                dispatch(updateUserPref({id: 'default', data: {recentViewedProjects: newRecent}}));
            })
        }
    }, [props.issue, openProject])

    return (
            <div className='mb-3'>
                <div className='d-flex flex-nowrap align-items-center '>
                    <div className='h3'>
                        {props.issue?.label}
                    </div>
                    <div className='mx-2'>
                        <CircleRotate loading={projectCommonQuery.loading}
                            onReload={props.onRefresh}
                        />
                    </div>
                    <div className='ms-auto'>
                        <DropdownAction 
                            actionCategory={[
                                {
                                    label: 'Action',
                                    value: 'action',
                                    items: [
                                        
                                    ]
                                }
                            ]}
                            bsIcon='three-dots'
                            handleItemClick={()=>{}}
                        />
                    </div>
                </div>
                <div className='d-flex'>
                    <div>
                        <Button 
                            label='Attach'
                            leftBsIcon='paperclip'
                            extraClasses='bg-as-light px-1'
                            handleClick={()=>{setAttach(true)}}
                            dynamicLabel
                        />
                    </div>
                    <div className='mx-2' hidden={props.issue?.type === 'child'}>
                        <Button 
                            label='Add child issue'
                            leftBsIcon='diagram-2'
                            dynamicLabel
                            extraClasses='px-1 btn-as-light'
                            handleClick={()=>{setAddChild(true)}}
                        />
                    </div>
                    <div className='mx-2' style={{width: '20%'}}>
                        <ButtonActionGroup 
                            items={[
                                {
                                    label: 'Link an issue',
                                    value: 'link-issue',
                                    leftBsIcon: 'link-45deg'
                                },
                                {
                                    label: 'Add web link',
                                    value: 'link-web',
                                    leftBsIcon: 'globe-asia-australia'
                                }
                            ]} 
                            onClick={(item)=>{
                                if (item.value === 'link-web'){
                                    setWebLink(true);
                                }else if (item.value === 'link-issue'){
                                    setLinkIssue(true);
                                }
                            }}                        
                    /> 
                    </div>
                    
                </div>
                
                <div className='my-2 w-100'>
                    <div className='mb-5'>
                        <h6>Description</h6>
                        <TextEditor 
                            value={props.issue?.id? {id: props.issue?.id, state: descEditor.value || props.issue?.description}: undefined}
                            open={descEditor.open}
                            onToggle={(open: boolean)=> setDescEditor({...descEditor, open})}
                            onSave={(value: string)=>{
                                projectCommonQuery.trigger({
                                    action: 'UPDATE',
                                    data: {
                                        projectId: openProject?.id,
                                        id: props.issue?.id || '',
                                        description: value,
                                    },
                                    itemType: 'issue'
                                } as CrudPayload)
                                .then(()=>{
                                    dispatch(updateIssue({id: props.issue?.id || '', data: {description: value}}))
                                })
                            }}
                            onChange={(data: any)=>{
                                setDescEditor(data);
                            }}
                        />
                    </div>
                    <div className='mb-5'>
                        <Attachment 
                            active={attach}
                            onToggle={setAttach}
                        />
                    </div>

                    {
                        props.issue?.type !== 'child' &&
                        <div className='mb-5'>
                            <ChildIssue active={addChild}
                                onToggle={setAddChild}
                            />
                        </div>
                    }
                    {
                        (linkedIssueCount > 0 || linkIssue) &&
                        <div className='mb-5'>
                            <LinkedIssue active={linkIssue}
                                onToggle={setLinkIssue}
                            />
                        </div>
                    }
                    {
                        (!isEmpty(props.issue?.webLinks) || webLink) &&
                        <div className='mb-5'>
                            <WebLink active={webLink}
                                onToggle={setWebLink}
                            />
                        </div>
                    }
                    <div className='my-5'>
                        <Activity />
                    </div>
                </div>
            </div>

    )
}

export default IssueMainView;