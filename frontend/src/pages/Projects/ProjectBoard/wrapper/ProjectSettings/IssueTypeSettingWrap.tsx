import { FC, useContext, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Split from 'react-split';
import { BreadCrumbItem } from "../../../../../components/BreadCrumb/BreadCrumb";
import BreadCrumb2 from "../../../../../components/BreadCrumb/BreadCrumb2";
import { ProjectBoardContext } from "../../ProjectBoard";
import IssueTypeSettingComponent from "../../ProjectSetting/IssueTypeSetting";
import ProjectSettingSideMenu from "../../SideMenus/ProjectSettingSideMenu";

const IssueTypeSettingWrap: FC = () => {
    const location = useLocation();
    const {openProject} = useContext(ProjectBoardContext);
    const navigate = useNavigate();

    const menuViews: BreadCrumbItem[] = useMemo(() => [
        {
            label: "Issue types",
            value: "issue-types",
            children: [
                {
                    label: "Bug",
                    value: "bug-issue",
                    children: [],
                    navigateTo: `/myp/projects/${openProject?.key}/project-settings/issue-types/bug-issue`
                },
                {
                    label: "Story",
                    value: "story-issue",
                    children: [],
                    navigateTo: `/myp/projects/${openProject?.key}/project-settings/issue-types/story-issue`
                },
                {
                    label: "Task",
                    value: "task-issue",
                    children: [],
                    navigateTo: `/myp/projects/${openProject?.key}/project-settings/issue-types/task-issue`
                },
            ],
        },
    ], [openProject]);
    return (
        <div className='h-100'>
            <Split className='d-flex flex-nowrap h-100'
                sizes={[20, 80]}
                minSize={200}
                maxSize={[600, Infinity]}
                expandToMin={false}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={0}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
                // onDrag={(sizes) => {setWindowSizes(sizes)}}
            >
                <div className=' p-2'>
                    <ProjectSettingSideMenu menuViews={menuViews} />
                </div>
                <div className='h-100'>
                    <IssueTypeSettingComponent />
                </div>
            </Split>
        </div>
    )
}

export default IssueTypeSettingWrap;