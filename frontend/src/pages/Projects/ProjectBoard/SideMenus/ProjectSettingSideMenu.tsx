import { uniqueId } from "lodash";
import { FC, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumbItem } from "../../../../components/BreadCrumb/BreadCrumb";
import { SimpleLink } from "../../../../components/LinkGroup/LinkGroup";
import MenuCard from "../../../../components/MenuCard/MenuCard";
import MenuOption from "../../../../components/MenuCard/MenuOption/MenuOption";
import { ProjectBoardContext } from "../ProjectBoard";
import "../ProjectBoard.css";

const ProjectSettingSideMenu: FC<{
	menuViews: BreadCrumbItem[];
	boardView?: BreadCrumbItem;
}> = ({ menuViews, boardView }) => {
	const navigate = useNavigate();
	const { openProject } = useContext(ProjectBoardContext);
	const bottomLinks: any[] = useMemo(
		() => [
		],
		[openProject]
	);

	return (
		<div className=" p-2">
			<div>
				<MenuCard
					label="SETTING OPTIONS"
					menuItems={menuViews}
					handleClick={(value) => {
						navigate(`/myp/projects/${openProject?.key}/${value}`);
					}}
					collapsable={false}
					showLabel={false}
					itemClass="option-hover-thm"
					itemType="option-quote-sm"
					selectedItem={boardView}
				/>
			</div>
			<hr />
			<div>
				{bottomLinks.map((link, index) => (
					<a
						key={`project-setting-side-menu-${index}`}
						href={link.navigateTo}
						className="no-link "
					>
						<MenuOption {...link} extraClasses="option-hover-thm" />
					</a>
				))}
			</div>
		</div>
	);
};

export default ProjectSettingSideMenu;
