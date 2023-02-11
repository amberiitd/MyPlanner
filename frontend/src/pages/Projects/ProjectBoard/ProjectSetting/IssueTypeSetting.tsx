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
} from "react-beautiful-dnd";
import "./IssueTypeSetting.css";
import { Issue } from "../Backlog/IssueRibbon/IssueRibbon";
import { useQuery } from "../../../../hooks/useQuery";
import {
	projectCommonChildCrud,
	projectCommonCrud,
} from "../../../../services/api";
import IssueFieldGroup from "./IssueField/IssueFieldGroup";
import { indexOf, sortBy } from "lodash";

export const IssueTypeSettingContext = createContext<{
	dragStart: DragStart | undefined;
	activeField: string | undefined;
	setActiveField: React.Dispatch<React.SetStateAction<string | undefined>>;
	issueTypeId?: string;
	issueTypeSetting?: IssueTypeSetting;
	setIssueTypeSetting: React.Dispatch<React.SetStateAction<IssueTypeSetting>>;
	issueFieldGroupMap: { [key: string]: IssueField[] };
}>({
	dragStart: undefined,
	activeField: undefined,
	setActiveField: () => {},
	setIssueTypeSetting: () => {},
	issueFieldGroupMap: {},
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
			}}
		>
			<DragDropContext
				onDragStart={(start, provided) => {
					console.log("start", start);
					setDragStart(start);
				}}
				onDragEnd={(res, provided) => {
					console.log("end", res);
					setDragStart(undefined);
					if (
						res.destination === undefined ||
						res.destination === null ||
						res.destination.index === undefined ||
						(res.destination?.droppableId ===
							res.source.droppableId &&
							res.destination.index === res.source.index)
					)
						return;
					let orderMap: { [key: string]: string[] } = Object.entries(
						issueFieldGroupMap
					).reduce((pre: any, cur) => {
						pre[cur[0]] = cur[1].map((f) => f.id);
						return pre;
					}, {});

					const draggedId = orderMap[res.source.droppableId].splice(
						res.source.index,
						1
					)[0];
					orderMap[res.destination.droppableId].splice(
						res.destination.index,
						0,
						draggedId
					);
					const newOrder = Object.values(orderMap).flat();
					if (
						res.destination.droppableId !== res.source.droppableId
					) {
						const newFieldList = issueTypeSetting.fieldList.map(
							(f) =>
								f.id === draggedId
									? {
											...f,
											category:
												res.destination?.droppableId ||
												"context",
									  }
									: f
						);
						if (
							issueFieldGroupMap[res.source.droppableId][
								res.source.index
							].index
						) {
							projectCommonChildQuery.trigger({
								action: "UPDATE",
								data: {
									projectId: openProject?.id,
									parentId: issueTypeId,
									childCurrentIndex:
										issueFieldGroupMap[
											res.source.droppableId
										][res.source.index].index,
									category: res.destination.droppableId,
									itemType: "fieldList",
								},
								itemType: "issueTypeSetting",
							} as CrudPayload);
						}

						setIssueTypeSetting({
							...issueTypeSetting,
							fieldList: newFieldList,
							fieldOrder: newOrder,
						});
					} else {
						setIssueTypeSetting({
							...issueTypeSetting,
							fieldOrder: newOrder,
						});
					}
					projectCommonQuery
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
					console.log("old order", issueTypeSetting.fieldOrder);
					console.log("new order", newOrder);
				}}
			>
				<div className="h-100 d-flex flex-nowrap px-0">
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
						className="h-100 border-start overflow-auto"
						style={{ width: "40em" }}
					></div>
				</div>
			</DragDropContext>
		</IssueTypeSettingContext.Provider>
	);
};

export default IssueTypeSettingComponent;
