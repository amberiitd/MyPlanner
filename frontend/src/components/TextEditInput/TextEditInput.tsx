import { FC, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";

interface TextEditInputProps {
	value: string;
	extraClasses?: string;
	inputClasses?: string;
	onValueChange: (value: string) => void;
	disabled?: boolean;
}

const TextEditInput: FC<TextEditInputProps> = (props) => {
	const [value, setValue] = useState<string>(props.value || "");
	const [active, setActive] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const handleSave = () => {
		if (value && props.value !== value) {
			props.onValueChange(value);
		}
		setActive(false);
	};

	const compRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleWindowClick = (e: any) => {
			if (
				compRef &&
				compRef.current &&
				compRef.current.contains(e.target)
			) {
			} else {
				setActive(false);
			}
		};

		document.addEventListener("click", handleWindowClick, true);

		return () => {
			document.removeEventListener("click", handleWindowClick, true);
		};
	}, []);

	return (
		<div ref={compRef} className="w-100">
			<div
				className={`p-1 bg-smoke-hover input-focus-transparent rounded ${props.extraClasses} ${
					!props.disabled ? "cursor-pointer" : ""
				} w-inherit`}
				onClick={() => {
					if (!props.disabled) {
						setActive(true);
					}
				}}
				hidden={active}
			>
				{props.value || "-"}
			</div>
			{active && (
				<div className="position-relative">
					<div className="input-focus rounded p-1">
						<input
							autoFocus
							ref={inputRef}
							className={`${props.inputClasses ?? "w-100"}`}
							type="text"
							value={value}
							onChange={(e) => {
								setValue(e.target.value);
							}}
						/>
					</div>

					<div
						className="d-flex flex-nowrap position-absolute w-100 mt-1"
						style={{ zIndex: 10 }}
					>
						<div className="ms-auto shadow-sm bg-white">
							<Button
								label="Save"
								hideLabel={true}
								leftBsIcon="check"
								extraClasses="px-1 btn-as-light"
								handleClick={handleSave}
							/>
						</div>
						<div className="ms-2 shadow-sm  bg-white">
							<Button
								label="Cancel"
								hideLabel={true}
								leftBsIcon="x"
								extraClasses="px-1 btn-as-light"
								handleClick={() => {
									setValue(props.value);
									setActive(false);
								}}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default TextEditInput;
