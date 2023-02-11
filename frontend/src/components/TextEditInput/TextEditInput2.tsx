import { FC, useEffect, useRef, useState } from "react";

interface TextEditInput2Props {
	value: string;
	extraClasses?: string;
	inputClasses?: string;
	onChange?: (value: string) => void;
	disabled?: boolean;
    active?: boolean;
}

const TextEditInput2: FC<TextEditInput2Props> = (props) => {
	const [active, setActive] = useState(!!props.active);
    useEffect(()=>{
        setActive(!!props.active);
    }, [props.active])
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
		<div ref={compRef} className="w-100" onClick={(e)=>{e.stopPropagation();}}>
			<div
				className={`bg-smoke-hover rounded ${
					props.extraClasses
				} ${!props.disabled ? "cursor-pointer" : ""} w-inherit`}
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
				<div className="position-relative"
                    
                >
					<div className="rounded">
						<input
							autoFocus
							className={`${props.inputClasses ?? "w-100 p-0"}`}
							type="text"
							value={props.value}
							onChange={(e)=> {if (props.onChange) props.onChange(e.target.value)}}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

export default TextEditInput2;
