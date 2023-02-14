import React, { useMemo } from "react";
import { FC, useContext } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import DropdownInfo from "../../../../../components/DropdownInfo/DropdownInfo";
import { IssueTypeSettingContext } from "../IssueTypeSetting";
import FieldTemplateCard from "./FieldTemplateCard";

export const fieldTemplates = [
	{
		label: "Short text",
		id: "text",
	},
	{
		label: "Number",
		id: "number",
	},
];
const FieldTemplate: FC = (props) => {
	const { dragStart, handleFieldDragend } = useContext(IssueTypeSettingContext);

	const removeDrop = useMemo(
		() =>
			dragStart &&
			["context", "description"].includes(dragStart.source.droppableId),
		[dragStart]
	);

	return (
		<React.Fragment>
			<div className="h-100 px-3 py-3" hidden={removeDrop}>
				<div className="d-flex align-items-center">
					<span className="fw-645">Fields</span>
					<DropdownInfo text="Fields capture and display the information people need to carry out a project's work" />
				</div>
				<div className="mt-2">
					{fieldTemplates
						.reduce((pre: any[][], cur) => {
							if (pre.length == 0) return [[cur]];
							if (pre[pre.length - 1].length >= 3) {
								pre.push([cur]);
							} else {
								pre[pre.length - 1].push(cur);
							}
							return pre;
						}, [])
						.map((ft, index1) => (
							<div key={`field-tmeplate-group-${index1}`}>
								<Droppable
									droppableId={`template-${index1}`}
									isDropDisabled={true}
									direction="horizontal"
								>
									{(provided, snapshot) => (
										<div
											className="d-flex"
											ref={provided.innerRef}
											{...provided.droppableProps}
										>
											{ft.map((t, index2) => (
												<Draggable
													index={3 * index1 + index2}
													draggableId={`field-tmeplate-${index1}-${index2}`}
													key={`field-tmeplate-${index2}`}
												>
													{(
														provided,
														snapshot,
														rubric
													) => (
														<div
															style={{
																height: "calc(6em + 2px)",
																width: "calc(8em + 2px)",
															}}
														>
															{dragStart &&
															!snapshot.isDragging ? (
																<div
																	ref={
																		provided.innerRef
																	}
																	{...provided.dragHandleProps}
																>
																	<FieldTemplateCard
																		{...t}
																	/>
																</div>
															) : dragStart &&
															  snapshot.isDragging ? (
																<React.Fragment>
																	<FieldTemplateCard
																		{...t}
																	/>
																	<div
																		ref={
																			provided.innerRef
																		}
																		{...provided.draggableProps}
																		{...provided.dragHandleProps}
																	>
																		<FieldTemplateCard
																			{...t}
																		/>
																	</div>
																</React.Fragment>
															) : (
																<div
																	ref={
																		provided.innerRef
																	}
																	{...provided.draggableProps}
																	{...provided.dragHandleProps}
                                                                    onClick={() => {handleFieldDragend({
                                                                        draggableId: `field-tmeplate-${index1}-${index2}`,
                                                                        type: "DEFAULT",
                                                                        source: {
                                                                            index: 3 * index1 + index2,
                                                                            droppableId: `template-${index1}`
                                                                        },
                                                                        reason: "DROP",
                                                                        mode: "FLUID",
                                                                        destination: {
                                                                            droppableId: "context",
                                                                            index: 0
                                                                        },
                                                                        combine: null
                                                                    })}}
																>
																	<FieldTemplateCard
																		{...t}
																	/>
																</div>
															)}
														</div>
													)}
												</Draggable>
											))}
											{/* {provided.placeholder} */}
										</div>
									)}
								</Droppable>
							</div>
						))}
				</div>
			</div>
			<div
				className={`h-100 ${
					removeDrop
						? "visible position-relative"
						: "invisible position-absolute top-0"
				}`}
			>
				<Droppable droppableId="trash" isDropDisabled={!removeDrop}>
					{(provided, snapsot) => (
						<div
							className={`h-100 px-3 ${
								removeDrop
									? "drop-accept-container"
									: "drop-container"
							}`}
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							<div className="p-2">
								<i className="bi bi-exclamation-triangle mx-2"></i>
								Drop here to remove!
							</div>
						</div>
					)}
				</Droppable>
			</div>
		</React.Fragment>
	);
};

export default FieldTemplate;
