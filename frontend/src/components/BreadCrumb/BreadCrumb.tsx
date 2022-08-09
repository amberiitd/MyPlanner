import _, { isEmpty } from 'lodash';
import { FC, useEffect, useState } from 'react';
import './BreadCrumb.css';

interface BreadCrumbItem{
    label: string;
    value: string;
    children: BreadCrumbItem[];
}

interface BreadCrumbProps{
    itemTree: BreadCrumbItem;
    handleClick: (event: any) => void;
    selectedItem: BreadCrumbItem;
}

const BreadCrumb: FC<BreadCrumbProps> = (props) => {
    const [path, setPath] = useState<BreadCrumbItem[]>([]);
    const getPathHelper: (itemNode: BreadCrumbItem, lastItem: BreadCrumbItem, path: BreadCrumbItem[]) => {path: BreadCrumbItem[], found: boolean} = (itemNode, lastItem, path) => {
        if (lastItem.value === itemNode.value){
            return {path, found: true};
        }
        if (isEmpty(itemNode.children)){
            return {path: [], found: false}
        }
        path.push(itemNode);
        for (let i=0; i< (itemNode.children).length; i+=1){
            const response = getPathHelper(itemNode.children[i], lastItem, path);

            if (response.found){
                return response;
            }
        }
        path.pop();
        return {path, found: false};
    }

    useEffect(()=>{
        const {path, found} = getPathHelper(props.itemTree, props.selectedItem, []);
        setPath(path);
    },[props])
    
    return (
        <div className='d-flex flex-nowrap py-3 text-grey'>
            {
                path.map((item, index) => (
                    <div className='me-2' key={`bread-curmb-item-${index}`} onClick={() => {props.handleClick(item)}}>    
                        <span className='crumb-link'>{item.label} </span><span>/</span>
                    </div>
                ))
            }
        </div>
    )
}

export default BreadCrumb;