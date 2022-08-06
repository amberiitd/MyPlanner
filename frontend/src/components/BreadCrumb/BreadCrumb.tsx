import _, { isEmpty } from 'lodash';
import { FC } from 'react';
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
    const getPath = () => {
        const {path, found} = getPathHelper(props.itemTree, props.selectedItem, []);
        return path;
    }
    return (
        <div className='d-flex flex-nowrap py-3 text-grey'>
            {
                getPath().map((item, index) => (
                    <div className='me-2' key={`bread-curmb-item-${index}`} onClick={() => {props.handleClick(item)}}>    
                        <span className='crumb-link'>{item.label} </span><span>/</span>
                    </div>
                ))
            }
        </div>
    )
}

export default BreadCrumb;