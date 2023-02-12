import { FC, useCallback, useEffect, useRef, useState } from "react";
import Button from "../Button/Button";

const DropdownInfo: FC<{text: string;}> = ({text}) => {
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
				style={{ left: "100%", top: 0 }}
			>
				{text}
			</div>
		</div>
	);
};

export default DropdownInfo;
