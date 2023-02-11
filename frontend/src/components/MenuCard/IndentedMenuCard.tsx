import { isEmpty } from "lodash";
import { FC, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectBoardContext } from "../../pages/Projects/ProjectBoard/ProjectBoard";
import BinaryAction from "../BinaryAction/BinaryAction";
import { MenuCardProps } from "./MenuCard";
import "./MenuCard.css";
import MenuOption from "./MenuOption/MenuOption";

const IndentedMenuCard: FC<MenuCardProps> = (props) => {
	const navigate = useNavigate();
	const { openProject } = useContext(ProjectBoardContext);
	const [showMenu, setShowMenu] = useState(true);
	return (
		<div className="">
			<MenuOption label={props.label} extraClasses="option-hover-thm" optionType="option-2">
				<div className="" hidden={!props.collapsable} >
					<BinaryAction
						label="Expand"
						bsIcon0="chevron-down"
						bsIcon1="chevron-right"
						handleClick={() => {
							setShowMenu(!showMenu);
						}}
					/>
				</div>
			</MenuOption>

			<div hidden={!showMenu} className="ms-3">
				{props.menuItems.map((item, index) =>
					item.navigateTo ? (
						<a
							className="mb-1 no-link"
							key={`menu-card-item-${index}`}
							href={item.navigateTo}
						>
							<MenuOption
								{...item}
								extraClasses={props.itemClass}
								optionType={props.itemType}
								isSelected={
									window.location.pathname === item.navigateTo
								}
							/>
						</a>
					) : isEmpty(item.children) ? (
						<div
							className="mb-1"
							key={`menu-card-item-${index}`}
							onClick={() => {
								props.handleClick(item.value);
							}}
						>
							<MenuOption
								{...item}
								extraClasses={props.itemClass}
								optionType={props.itemType}
								isSelected={
									props.selectedItem?.value === item.value
								}
							/>
						</div>
					) : (
						<IndentedMenuCard
                            key={`menu-card-item-${index}`}
							label={item.label}
							menuItems={item.children}
							handleClick={(value) => {
								navigate(
									`/myp/projects/${openProject?.key}/${item.value}/${value}`
								);
							}}
							collapsable={true}
							showLabel={true}
							itemClass="option-hover-thm"
							itemType="option-quote-sm"
						/>
					)
				)}
			</div>
		</div>
	);
};

export default IndentedMenuCard;
