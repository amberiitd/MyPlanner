import {
	createContext,
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { useParams } from "react-router-dom";
import DndContainer from "../../../../components/AtlassianDnd/DndContainer";
import BreadCrumb2 from "../../../../components/BreadCrumb/BreadCrumb2";
import DropdownAction from "../../../../components/DropdownAction/DropdownAction";
import TextEditInput from "../../../../components/TextEditInput/TextEditInput";
import {
	CrudPayload,
	IssueField,
	IssueTypeSetting,
	SimpleAction,
} from "../../../../model/types";
import { BUG } from "../Backlog/IssueCreator/IssueTypeSelector/issueTypes";
import { ProjectBoardContext } from "../ProjectBoard";
import {
	DragDropContext,
	Draggable,
	DragStart,
	Droppable,
	DropResult,
} from "react-beautiful-dnd";
import "./IssueTypeSetting.css";
import { Issue } from "../Backlog/IssueRibbon/IssueRibbon";
import { useQuery } from "../../../../hooks/useQuery";
import {
	projectCommonChildCrud,
	projectCommonCrud,
} from "../../../../services/api";
import IssueFieldGroup from "./IssueField/IssueFieldGroup";
import { indexOf, sortBy, uniqueId } from "lodash";
import FieldTemplate, { fieldTemplates } from "./IssueField/FieldTemplate";
import { generateUID } from "../../../../util/method";
import { Modal } from "react-bootstrap";
import Button from "../../../../components/Button/Button";

export const IssueTypeSettingContext = createContext<{
	dragStart: DragStart | undefined;
	activeField: string | undefined;
	setActiveField: React.Dispatch<React.SetStateAction<string | undefined>>;
	issueTypeId?: string;
	issueTypeSetting?: IssueTypeSetting;
	setIssueTypeSetting: React.Dispatch<React.SetStateAction<IssueTypeSetting>>;
	issueFieldGroupMap: { [key: string]: IssueField[] };
	handleFieldDragend: (res: DropResult) => void;
}>({
	dragStart: undefined,
	activeField: undefined,
	setActiveField: () => {},
	setIssueTypeSetting: () => {},
	issueFieldGroupMap: {},
	handleFieldDragend: () => {},
});

interface IssueTypeSettingProps {}

const IssueTypeSettingComponent: FC<IssueTypeSettingProps> = (props) => {
	const fieldGroups = [
		{
			label: "Description fields",
			id: "description",
			description: "a test description field",
		},
		{
			label: "Context fields",
			id: "context",
			description: "a test description field",
		},
	];
	const { openProject } = useContext(ProjectBoardContext);
	const { issueTypeId } = useParams();
	const [issueTypeSetting, setIssueTypeSetting] = useState<IssueTypeSetting>({
		fieldList: [],
	});
	const [dragStart, setDragStart] = useState<DragStart | undefined>();
	const projectCommonQuery = useQuery((payload: CrudPayload) =>
		projectCommonCrud(payload)
	);
	const projectCommonChildQuery = useQuery((payload: CrudPayload) =>
		projectCommonChildCrud(payload)
	);
	const [activeField, setActiveField] = useState<string | undefined>();
	const [removeModal, setRemoveModal] = useState<{
		show: boolean;
		field: IssueField | undefined;
		onRemove?: () => Promise<any>;
	}>({ show: false, field: undefined });
	const issueFieldGroupMap: { [key: string]: IssueField[] } = useMemo(
		() =>
			fieldGroups.reduce((pre: any, cur) => {
				pre[cur.id] = sortBy(
					(issueTypeSetting?.fieldList || [])
						.map((f, index) => ({ ...f, index }))
						.filter((f) => f.category === cur.id),
					(f: IssueField) => {
						const index = indexOf(
							issueTypeSetting?.fieldOrder || [],
							f.id
						);
						return index >= 0 ? index : 99999;
					}
				);
				return pre;
			}, {}),
		[issueTypeSetting]
	);
	const handleFieldDragend = useCallback(
		(res: DropResult) => {
			setDragStart(undefined);
			if (
				res.destination === undefined ||
				res.destination === null ||
				res.destination.index === undefined ||
				(res.destination?.droppableId === res.source.droppableId &&
					res.destination.index === res.source.index)
			)
				return;
			let orderMap: { [key: string]: string[] } = Object.entries(
				issueFieldGroupMap
			).reduce((pre: any, cur) => {
				pre[cur[0]] = cur[1].map((f) => f.id);
				return pre;
			}, {});

			// process the source dep
			let draggedId: string;
			const alreadyExist = !res.source.droppableId.startsWith("template");
			if (alreadyExist) {
				draggedId = orderMap[res.source.droppableId].splice(
					res.source.index,
					1
				)[0];
			} else {
				draggedId = generateUID();
			}

			// process the destination dep
			const beingRemoved = res.destination.droppableId === "trash";
			if (!beingRemoved) {
				orderMap[res.destination.droppableId].splice(
					res.destination.index,
					0,
					draggedId
				);
			} else {
			}

			const newOrder = Object.values(orderMap).flat();
			const processFields = async (
				action: string,
				newIndex: number,
				newFieldList: any[],
				updateData: any
			) => {
				const promise = projectCommonChildQuery.trigger({
					action,
					data: {
						projectId: openProject?.id,
						parentId: issueTypeId,
						childCurrentIndex: newIndex,
						...updateData,
						itemType: "fieldList",
					},
					itemType: "issueTypeSetting",
				} as CrudPayload);

				setIssueTypeSetting({
					...issueTypeSetting,
					fieldList: newFieldList,
					fieldOrder: newOrder,
				});

				return promise;
			};

			const processFieldOrder = async () => {
				return projectCommonQuery
				.trigger({
					action: "UPDATE",
					data: {
						projectId: openProject?.id,
						id: issueTypeId,
						fieldOrder: newOrder,
					},
					itemType: "issueTypeSetting",
				} as CrudPayload)
				.then(() => {});
			};

			if (res.destination.droppableId !== res.source.droppableId) {
				let newFieldList: any[];
				let newIndex: number | undefined;
				let updateData = {};
				let action = "UPDATE";

				if (beingRemoved) {
					newIndex =
						issueFieldGroupMap[res.source.droppableId][
							res.source.index
						].index;
					action = "DELETE";
					newFieldList = issueTypeSetting.fieldList.filter(
						(f) => f.id !== draggedId
					);
					setRemoveModal({
						show: true,
						field: issueFieldGroupMap[res.source.droppableId][
							res.source.index
						],
						onRemove: () => {
							processFieldOrder();

							return processFields(
								action,
								newIndex || 0,
								newFieldList,
								updateData
							);
						},
					});
				} else if (alreadyExist) {
					newIndex =
						issueFieldGroupMap[res.source.droppableId][
							res.source.index
						].index;
					updateData = {
						category: res.destination.droppableId,
					};

					newFieldList = issueTypeSetting.fieldList.map((f) =>
						f.id === draggedId
							? {
									...f,
									category:
										res.destination?.droppableId ||
										"context",
							  }
							: f
					);
					processFields(
						action,
						newIndex || 0,
						newFieldList,
						updateData
					);
					processFieldOrder();
				} else {
					newIndex = issueTypeSetting.fieldList.length;
					updateData = {
						label: "",
						id: draggedId,
						fieldType: fieldTemplates[res.source.index].id,
						category: res.destination?.droppableId || "context",
					};
					action = "INSERT";

					newFieldList = issueTypeSetting.fieldList.concat([
						updateData as IssueField,
					]);
					setActiveField(draggedId);
					processFields(
						action,
						newIndex || 0,
						newFieldList,
						updateData
					);
					processFieldOrder();
				}
			} else {
				setIssueTypeSetting({
					...issueTypeSetting,
					fieldOrder: newOrder,
				});
                processFieldOrder();
			}
			

			// console.log("end", res);
			// console.log("old order", issueTypeSetting.fieldOrder);
			// console.log("new order", newOrder);
		},
		[
			projectCommonQuery,
			openProject,
			issueTypeId,
			issueTypeSetting,
			issueFieldGroupMap,
		]
	);
	const onRefresh = useCallback(() => {
		projectCommonQuery
			.trigger({
				action: "RETRIEVE_ITEM",
				data: { projectId: openProject?.id, id: issueTypeId },
				itemType: "issueTypeSetting",
			} as CrudPayload)
			.then((res) => {
				setIssueTypeSetting(res);
			});
	}, [openProject]);

	useEffect(() => {
		onRefresh();
	}, [openProject]);

	// useEffect(() => {
	// 	console.log("dragStart", dragStart);
	// }, [dragStart]);

	return (
		<IssueTypeSettingContext.Provider
			value={{
				issueTypeId,
				issueTypeSetting,
				activeField,
				setActiveField,
				setIssueTypeSetting,
				dragStart,
				issueFieldGroupMap,
				handleFieldDragend,
			}}
		>
			<DragDropContext
				onDragStart={(start, provided) => {
					// console.log("start", start);
					setDragStart(start);
				}}
				onDragEnd={(res, provided) => {
					handleFieldDragend(res);
				}}
			>
				<div className="h-100 d-flex flex-nowrap px-0 overflow-auto">
					<div
						className="h-100 w-100 ps-4"
						style={{ minWidth: "40em" }}
					>
						<div className="h4em pe-3">
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
						{openProject && (
							<div className="board-body h100-4em">
								<div className="h4em d-flex align-items-center pe-3">
									<div className="p-2">
										<i
											className={`bi bi-${BUG.leftBsIcon}`}
										></i>
									</div>
									<div className="h3 w-100 m-0 me-2">
										<TextEditInput
											value={"Bug"}
											onValueChange={() => {}}
											extraClasses="p-2"
											inputClasses="h3 m-0 w-100"
										/>
									</div>
									<div className="ms-auto">
										<DropdownAction
											actionCategory={[
												{
													label: "Actions",
													value: "actions",
													items: [],
												},
											]}
											buttonClass="btn-as-bg px-2 py-1"
											bsIcon="three-dots"
											handleItemClick={() => {}}
										/>
									</div>
								</div>
								<div className="h100-4em">
									<div className="h3em d-flex align-items-center pe-3">
										<TextEditInput
											value={
												"Bugs track problems or errors."
											}
											onValueChange={() => {}}
										/>
									</div>
									<div className="h100-3em py-3 overflow-auto pe-3">
										{fieldGroups.map((g, index) => (
											<div
												key={`field-group-${index}`}
												className="mb-3"
											>
												<IssueFieldGroup
													label={g.label}
													id={g.id}
													description={g.description}
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						)}
					</div>
					<div
						className="h-100 border-start bg-light position-relative"
						style={{ minWidth: "375px" }}
					>
						<FieldTemplate />
					</div>
				</div>
			</DragDropContext>
			<Modal show={removeModal.show}>
				<Modal.Body className="p-2">
					Do you want to remove issue: {removeModal.field?.label}?
				</Modal.Body>
				<Modal.Header className="p-2 d-flex">
					<div className="ms-auto me-2">
						<Button
							label="Cancel"
							extraClasses="btn-as-light px-2 py-1"
							handleClick={() => {
								setRemoveModal({
									show: false,
									field: undefined,
								});
							}}
						/>
					</div>
					<div className="">
						<Button
							label="Remove"
							extraClasses="btn-as-light px-2 py-1"
							handleClick={() => {
								if (removeModal.onRemove)
									removeModal.onRemove().then(() => {
										setRemoveModal({
											show: false,
											field: undefined,
										});
									});
							}}
						/>
					</div>
				</Modal.Header>
			</Modal>
		</IssueTypeSettingContext.Provider>
	);
};

export default IssueTypeSettingComponent;
