import { indexOf, isEmpty, sortBy, uniqueId } from "lodash";
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Button from "../../../../../components/Button/Button";
import DropdownInfo from "../../../../../components/DropdownInfo/DropdownInfo";
import { IssueField } from "../../../../../model/types";
import { IssueTypeSettingContext } from "../IssueTypeSetting";
import IssueFieldItem from "./IssueFieldItem";

interface IssueFieldGroupProps {
	label: string;
	id: string;
	description?: string;
}

const IssueFieldGroup: FC<IssueFieldGroupProps> = (props) => {
	const { issueTypeId, issueTypeSetting, dragStart, issueFieldGroupMap } = useContext(
		IssueTypeSettingContext
	);

	return (
		<div>
			<div className="px-1 d-flex align-items-center">
				<div className="fw-645">{props.label}</div>
				{props.description && (
					<DropdownInfo text={props.description} />
				)}
			</div>
			<div
				className={`p-1 mb-3 rounded ${
					dragStart &&
					["context", "description", 'template-0', 'template-1'].includes(
						dragStart?.source.droppableId
					)
						? "drop-accept-container"
						: "drop-container"
				}`}
			>
				<Droppable droppableId={props.id}>
					{(provided, snapshot) => (
						<div
							ref={provided.innerRef}
							{...provided.droppableProps}
                            
						>
							{(issueFieldGroupMap[props.id]).map((f, index) => (
								<Draggable
									key={`${props.id}-${f.id || uniqueId()}`}
									index={index}
									draggableId={`${props.id}-${f.id || uniqueId()}`}
								>
									{(provided, snapshot, rubric) => (
										<div
											className="mb-1"
											ref={provided.innerRef}
											{...provided.draggableProps}
											{...provided.dragHandleProps}
										>
											<IssueFieldItem {...f} />
										</div>
									)}
								</Draggable>
							))}
							{provided.placeholder}
                            {
                                isEmpty(issueFieldGroupMap[props.id]) &&
                                <div className="p-3 text-center bg-thm text-muted">Drop here</div>
                            }
						</div>
					)}
				</Droppable>
			</div>
			{/* {(issueTypeSetting?.fieldList || [])
				.map((f, index) => ({ ...f, index }))
				.filter((f) => f.category === props.id)
				.map((f, index) => (
					<div key={`${props.id}-${f.label}`} className="mb-1">
						<IssueFieldItem {...f} />
					</div>
				))} */}
		</div>
	);
};

export default IssueFieldGroup;
