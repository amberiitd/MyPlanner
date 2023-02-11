import { uniqueId } from "lodash";
import { FC } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

interface DndContainerProps {
	id: string;
	children: any;
	className?: string;
}

const DndContainer: FC<DndContainerProps> = (props) => {
	const elemId = uniqueId();
	return (
		<Droppable droppableId={props.id || elemId}>
			{(provided, snapshot) => (
				<div
					id={props.id || elemId}
					className={props.className}
					ref={provided.innerRef}
					style={{
						backgroundColor: snapshot.isDraggingOver
							? "blue"
							: "grey",
					}}
					{...provided.droppableProps}
				>
					{props.children.map((child: any, index: number) => (
						<Draggable
							key={`${props.id || elemId}-${index}`}
							index={index}
							draggableId={`${props.id || elemId}-${index}`}
						>
							{(provided, snapshot, rubric) => (
								<div
									className=""
									ref={provided.innerRef}
									{...provided.draggableProps}
									{...provided.dragHandleProps}
								>
									{child}
								</div>
							)}
						</Draggable>
					))}
                    {provided.placeholder}
				</div>
			)}
		</Droppable>
	);
};

export default DndContainer;
