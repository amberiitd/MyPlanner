import { createContext, FC, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './IssueView.css';
import Split from 'react-split';
import DropdownAction from '../../../../components/DropdownAction/DropdownAction';
import TextEditor from '../../../../components/input/TextEditor/TextEditor';
import { ProjectBoardContext } from '../ProjectBoard';

interface IssueViewProps{

}


export const IssueViewContext = createContext<{
    windowSizes: number[]
}>({windowSizes: []});


const IssueView: FC<IssueViewProps> = (props) => {
    const [windowSizes, setWindowSizes] = useState<number[]>([60, 40]);
    const boardSizes = useContext(ProjectBoardContext).windowSizes;
    const containerRef = useRef<HTMLDivElement>(null);

    const [viewType, setViewType] = useState<1 | 2>(2);
    const handleResize = useCallback(() => {
        if (
            containerRef && containerRef.current 
            && containerRef.current.clientWidth < 700
        ){
            setViewType(1);
        }else{
            setViewType(2);
        }
    }, [containerRef]); 

    useEffect(() => {
        handleResize();
    }, [boardSizes, containerRef]);

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => {window.removeEventListener('resize', handleResize)}
    }, []);

    const mainView = (
        <div className='mb-3'>
            <div className='d-flex flex-nowrap align-items-center '>
                <div className='h3'>
                    {'Test Issue Label'}
                </div>
                <div className='ms-auto'>
                    <DropdownAction 
                        actionCategory={[
                            {
                                label: 'Action',
                                value: 'action',
                                items: [
                                    
                                ]
                            }
                        ]}
                        bsIcon='three-dots'
                        handleItemClick={()=>{}}
                    />
                </div>
            </div>
            
            <div className='my-2 w-100'>
                <p>Description</p>
                <div className=''>
                    <TextEditor />
                </div>
            </div>
        </div>
    );
    return (
        <IssueViewContext.Provider value={{windowSizes}}>
            <div ref={containerRef} className=' h-100 overflow-auto' style={{minWidth: '350px'}}>
                {   
                    viewType === 2 ?
                    <Split 
                        sizes={windowSizes}
                        minSize={[500, 300]}
                        maxSize={[Infinity, 600]}
                        expandToMin={false}
                        gutterSize={10}
                        gutterAlign="center"
                        snapOffset={30}
                        dragInterval={1}
                        direction="horizontal"
                        cursor="col-resize"
                        className='h-100 d-flex flex-nowrap font-thm'
                        onDrag={(sizes) => {setWindowSizes(sizes)}}
                    >
                        <div>
                            {mainView}
                        </div>
                        <div>

                        </div>
                    </Split>
                    : 
                    mainView
                }
            </div>
        </IssueViewContext.Provider>
    )
}

export default IssueView;