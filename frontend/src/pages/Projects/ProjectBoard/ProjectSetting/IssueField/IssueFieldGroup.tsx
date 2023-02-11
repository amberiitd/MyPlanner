import { indexOf, isEmpty, sortBy } from "lodash";
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
	const [info, setInfo] = useState(false);
	const infoRef = useRef<HTMLDivElement>(null);
	const handleWindowClick = useCallback((e: any) => {
		if (infoRef?.current?.contains(e.target)) {
		} else {
			setInfo(false);
		}
	}, []);

	useEffect(() => {
		window.addEventListener("click", handleWindowClick);
		return () => {
			window.removeEventListener("click", handleWindowClick);
		};
	}, []);
	return (
		<div>
			<div className="px-1 d-flex align-items-center">
				<div className="fw-645">{props.label}</div>
				{props.description && (
					<div ref={infoRef} className="dropend mx-2">
						<Button
							label={"Info"}
							hideLabel
							extraClasses="btn-as-bg p-1 px-2 "
							leftBsIcon="info-circle"
							handleClick={() => {
								setInfo(!info);
							}}
						/>
						<div
							className={`dropdown-menu border shadow-sm p-2 ${
								info ? "show" : ""
							} f-80`}
							style={{ left: "100%", bottom: 0 }}
						>
							{props.description}
						</div>
					</div>
				)}
			</div>
			<div
				className={`p-1 mb-3 rounded ${
					dragStart &&
					["context", "description"].includes(
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
									key={`${props.id}-${f.label}`}
									index={index}
									draggableId={`${props.id}-${f.label}`}
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
