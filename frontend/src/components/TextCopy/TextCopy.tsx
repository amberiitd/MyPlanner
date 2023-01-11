import { FC, useEffect, useState } from "react";
import Button from "../Button/Button";

interface TextCopyProps{
    text: string;
    bsIcon: string;
    title?: string;
}

const TextCopy: FC<TextCopyProps> = (props) => {
    const [copied, setCopied] = useState(false);
    const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
    const [title, setTitle] = useState(props.title || 'Copy text');
    useEffect(()=>{
        if (timer) clearTimeout(timer);
        if (copied){
            setTimer(setTimeout(()=>{
                setCopied(false);
            }, 5000))
        }else{
            setTimer(undefined);
        }
    }, [copied])
    return (
        <div
            title={title}
            onMouseEnter={()=>{
                setTitle(props.title || 'Copy text');
            }}
        >
            <Button 
                label={'Copy issue link'} 
                hideLabel={true}
                rightBsIcon={copied ? 'check': (props.bsIcon || 'clipboard')}
                extraClasses='btn-as-bg ps-1'
                handleClick={()=>{
                    navigator.clipboard.writeText(props.text);
                    setCopied(true);
                    setTitle('Copied')
                }}
            />
            
        </div>
    )
}

export default TextCopy;