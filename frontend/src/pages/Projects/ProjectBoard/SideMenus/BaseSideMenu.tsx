import { uniqueId } from "lodash";
import { FC, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumbItem } from "../../../../components/BreadCrumb/BreadCrumb";
import { SimpleLink } from "../../../../components/LinkGroup/LinkGroup";
import MenuCard from "../../../../components/MenuCard/MenuCard";
import MenuOption from "../../../../components/MenuCard/MenuOption/MenuOption";
import { ProjectBoardContext } from "../ProjectBoard";
import "../ProjectBoard.css";

const BaseSideMenu: FC<{
	menuViews: BreadCrumbItem[];
	boardView?: BreadCrumbItem;
}> = ({ menuViews, boardView }) => {
	const navigate = useNavigate();
	const { openProject } = useContext(ProjectBoardContext);
	const bottomLinks: any[] = useMemo(
		() => [
			{
				label: "Project settings",
				value: "project-settings",
				navigateTo: `/myp/projects/${openProject?.key}/project-settings/issue-types`,
				leftBsIcon: "gear-wide",
			},
		],
		[openProject]
	);

	return (
		<div className=" p-2">
			<div>
				<MenuCard
					label="PLANNING"
					menuItems={menuViews}
					handleClick={(value) => {
						navigate(`/myp/projects/${openProject?.key}/${value}`);
					}}
					collapsable={true}
					showLabel={true}
					itemClass="option-hover-thm"
					itemType="option-quote-sm"
					selectedItem={boardView}
				/>
			</div>
			<hr />
			<div>
				{bottomLinks.map((link) => (
					<a
						key={uniqueId()}
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

export default BaseSideMenu;
