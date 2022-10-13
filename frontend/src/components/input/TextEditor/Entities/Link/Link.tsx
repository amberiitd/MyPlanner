import { FC, useCallback, useState } from 'react';
import './Link.css';

interface LinkProps{
    onInput: (entity: any) => void;
}

const Link: FC<LinkProps> = (props) => {
    const [link, setLink] = useState('');
    const [text, setText] = useState('');

    const valid = (url: string) => {
        const allowedPrefix = ['https://', 'http://', 'www.'];
        return allowedPrefix.reduce((pre, cur)=> pre || url.startsWith(cur), false);
    }
    const handleKeyPress = useCallback((e: any) => {
        if (e.key === 'Enter'){
            if (valid(link)){
                props.onInput({
                    type: 'LINK',
                    mutability: 'MUTABLE',
                    data: {
                        url: link,
                        label: text
                    }
                })
            }
        }
    }, [link, text])
    return (
        <div className='py-2 rounded shadow-sm border' style={{borderColor: 'whitesmoke', backgroundColor: 'white'}}>
            <div className='d-flex flex-nowrap'>
                <div className='p-1 mx-auto'  style={{width: '2em'}}><i className='bi bi-link-45deg'></i></div>
                <input className='outline-none' type='text' value={link} placeholder='Paste or type a link adress'
                    onChange={(e) => setLink(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    style={{width: '25em', height: '2em'}}
                />
            </div>
            <hr className='p-0 m-0'/>
            <div className='d-flex flex-nowrap'>
                <div className='p-1 mx-auto'  style={{width: '2em'}}><i className='bi bi-body-text m-1'></i></div>
                <input className='outline-none' type='text' value={text} placeholder='Text to display'
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e)}
                    style={{width: '25em', height: '2em'}}
                />
            </div>
        </div>
    )
}

export default Link;