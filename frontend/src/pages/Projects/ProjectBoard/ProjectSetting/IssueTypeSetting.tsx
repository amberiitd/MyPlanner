import { FC, useContext } from "react";
import BreadCrumb2 from "../../../../components/BreadCrumb/BreadCrumb2";
import { ProjectBoardContext } from "../ProjectBoard";

interface IssueTypeSettingProps {}

const IssueTypeSetting: FC<IssueTypeSettingProps> = (props) => {
	const { openProject } = useContext(ProjectBoardContext);
	return (
		<div className="h-100 d-flex flex-nowrap px-0">
			<div className="h-100 w-100 ps-4 pe-3 overflow-auto" style={{minWidth: '40em'}}>
				<div className="h4em">
					<BreadCrumb2
						links={[
							{
								label: "Projects",
								href: "/myp/projects",
							},
							{
								label: `${openProject?.key}`,
								href: `/myp/projects/${openProject?.key}`,
							},
							{
								label: "Project settings",
								href: `/myp/projects/${openProject?.key}/project-settings`,
							},
						]}
					/>
				</div>
				{openProject && <div className="board-body h100-4em"></div>}
			</div>
            <div className="h-100 border-start overflow-auto" style={{width: '40em'}}>

            </div>
		</div>
	);
};

export default IssueTypeSetting;
