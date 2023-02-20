import { FC, useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "../../../../../components/Button/Button";
import { BacklogContext } from "../Backlog";

const DeleteModal: FC = () => {
	const { deleteModal, setDeleteModal } = useContext(BacklogContext);
    const [loading, setLoading] = useState(false);
	return (
		<Modal show={deleteModal.show}>
			<Modal.Header className="p-3 h5">
				<div className="fw-645">
					<i
						className="bi bi-exclamation-diamond-fill me-2"
						style={{ color: "red" }}
					></i>
					Delete
					<span className="ms-2">{deleteModal.entityLabel}</span>
				</div>
			</Modal.Header>
			<Modal.Body className="p-3">
				{deleteModal.messageElement || (
					<p>
						You are about to delete {deleteModal.entityType}{" "}
						<span className="ms-1 fw-645">
							{deleteModal.entityLabel}
						</span>
					</p>
				)}
			</Modal.Body>
			<Modal.Footer className="p-2 px-3">
				<div className="ms-auto me-2">
					<Button
						label="Delete"
                        disabled={loading}
						extraClasses="btn-as-danger p-1"
						handleClick={() => {
                            if (deleteModal.onDelete) {
                                setLoading(true);
                                deleteModal.onDelete().then(()=> {
                                    setLoading(false);
                                    setDeleteModal({show: false})
                                })
                                .catch((err)=>{
                                    setLoading(false);
                                })
                            }
                        }}
					/>
				</div>
				<div className="">
					<Button
						label="Cancel"
						extraClasses="btn-as-light p-1"
						handleClick={() => setDeleteModal({ show: false })}
					/>
				</div>
			</Modal.Footer>
		</Modal>
	);
};

export default DeleteModal;
