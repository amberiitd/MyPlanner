import { FC, useContext, useState } from "react";
import * as _ from "lodash";
import {
	Accordion,
	AccordionCollapse,
	useAccordionButton,
} from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../../../../../components/input/TextInput/TextInput";
import TextEditInput2 from "../../../../../components/TextEditInput/TextEditInput2";
import Button from "../../../../../components/Button/Button";
import { IssueTypeSettingContext } from "../IssueTypeSetting";
import { ProjectBoardContext } from "../../ProjectBoard";
import { useQuery } from "../../../../../hooks/useQuery";
import { CrudPayload } from "../../../../../model/types";
import { projectCommonChildCrud } from "../../../../../services/api";

interface IssueFieldItemProps {
	label: string;
	fieldType: string;
	id: string;
	description?: string;
	defaultValue?: string | number;
	index?: number;
}
const IssueFieldItem: FC<IssueFieldItemProps> = (props) => {
	const {
		activeField,
		setActiveField,
		issueTypeId,
		setIssueTypeSetting,
		issueTypeSetting,
	} = useContext(IssueTypeSettingContext);
	const { openProject } = useContext(ProjectBoardContext);
	const projectCommonChildQuery = useQuery((payload: CrudPayload) =>
		projectCommonChildCrud(payload)
	);
	const {
		reset,
		watch,
		setValue,
		getValues,
		handleSubmit,
		formState: { errors },
		control,
	} = useForm({
		defaultValues: {
			label: props.label,
			description: props.description || "",
			defaultValue: props.defaultValue,
		},
	});
	const formValues = watch();

	const onSubmit = (data: any) => {};

	return (
		<Accordion className="p-2 border rounded bg-white" activeKey={activeField}>
			<div
				className="d-flex align-items-center"
				onClick={() => {
					if (activeField === props.id) {
						setActiveField(undefined);
					} else {
						setActiveField(props.id);
					}
				}}
			>
				<div>
					<i className={`bi bi-${fieldBsIconMap[props.fieldType]} me-2`}></i>
				</div>
				{activeField === props.id ? (
					<Controller
						control={control}
						name="label"
						rules={{}}
						render={({ field: { value } }) => (
							<TextEditInput2
								value={value}
								onChange={(value) => {
									setValue("label", value);
								}}
								active={activeField === props.id}
							/>
						)}
					/>
				) : (
					<div>{formValues.label}</div>
				)}
				<div className="ms-auto cursor-pointer">
					<i
						className={`bi bi-chevron-${
							activeField === props.id ? "down" : "right"
						} ms-2`}
					></i>
				</div>
			</div>

			<AccordionCollapse eventKey={props.id}>
				<div className="mt-3">
					<div className="mb-3 f-90 fw-645 text-muted">
						<Controller
							control={control}
							name="description"
							rules={{}}
							render={({ field: { value } }) => (
								<TextInput
									label="Description"
									value={value}
									handleChange={(value) => {
										setValue("description", value);
									}}
								/>
							)}
						/>
					</div>
					<div className="mb-3 f-90 fw-645 text-muted">
						<Controller
							control={control}
							name="defaultValue"
							rules={{}}
							render={({ field: { value } }) => (
								<TextInput
									label="Default value"
									value={_.toString(value)}
									handleChange={(value) => {
										setValue("defaultValue", value);
									}}
								/>
							)}
						/>
					</div>

					<div className="pt-2 border-top border-2 d-flex">
						<div className="ms-auto me-2">
							<Button
								label="Remove"
								extraClasses="btn-as-light px-2 py-1"
								handleClick={() => {}}
							/>
						</div>
						<div>
							<Button
								label="Save"
								handleClick={handleSubmit((data) => {
									if (
										!openProject ||
										props.index === undefined
									)
										return;
									projectCommonChildQuery
										.trigger({
											action: "UPDATE",
											data: {
												projectId: openProject?.id,
												parentId: issueTypeId,
												childCurrentIndex: props.index,
												...data,
												itemType: "fieldList",
											},
											itemType: "issueTypeSetting",
										} as CrudPayload)
										.then(() => {
											setIssueTypeSetting({
												...(issueTypeSetting || {}),
												fieldList: (
													issueTypeSetting?.fieldList ||
													[]
												).map((f) =>
													f.id === props.id
														? { ...f, ...data }
														: f
												),
											});
                                            setActiveField(undefined);
										});
								})}
                                disabled={projectCommonChildQuery.loading}
							/>
						</div>
					</div>
				</div>
			</AccordionCollapse>
		</Accordion>
	);
};

export default IssueFieldItem;

const CustomToggle: FC<{ children: any; eventKey: string }> = ({
	children,
	eventKey,
}) => {
	const decoratedOnClick = useAccordionButton(eventKey, (e) => {
		console.log(e);
	});

	return (
		<div className="cursor-pointer" onClick={decoratedOnClick}>
			{children}
		</div>
	);
};

export const fieldBsIconMap: { [key: string]: string } = {
	text: "type",
	number: "123",
};
