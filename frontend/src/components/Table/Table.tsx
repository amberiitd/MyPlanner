import { isEmpty, startCase, uniqueId } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Type } from 'typescript';
import { SimpleAction } from '../../model/types';
import BinaryAction from '../BinaryAction/BinaryAction';
import Button from '../Button/Button';
import DropdownAction from '../DropdownAction/DropdownAction';
import './Table.css';

export interface ColDef{
    label: string;
    value?: string;
    valueGetter?: (row: any)=> any;
    cellRenderer?:(row: any)=> JSX.Element;
    type?: Type;
    sortable?: boolean;
    hideLabel?: boolean;
    bsIcon?:boolean;
    aslink?:{
        style?: string;
        to?: string;
        hrefGetter?: (key: string) => string;
        handleClick?: (e: any) => void;
    },
    extraClasses?: string;
    className?: string;
}

export interface RowAction{
    items: (SimpleAction & {buttonClasses?: string; bsIcon?: string; hideLabel?: boolean})[];
    layout?: 'button' | 'dropdown';
    handleAction: (rowdata: any, event: any) => void;
}

interface TableProps{
    colDef?: ColDef[];
    data: any[];
    actions?: RowAction;
    rowClickable?: boolean;
    selectable?: boolean;
    multiselect?: boolean; 
    onSelectionChange?: (rows: any[]) => void;
}

const Table: FC<TableProps> = (props) => {
    const [defaultColDef, setDefaultColDef] = useState<ColDef[]>([]);
    const [indexedData, setIndexedData] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const getDefaultColDef = (data: any[]) => {
        let coldefMap: {
            [key: string]: ColDef;
        } ={};

        data.forEach(rowdata => {
            Object.keys(rowdata).forEach(colname => {
                if (!coldefMap[colname]){
                    coldefMap[colname] = {
                        label: startCase(colname),
                        value: colname
                    }
                }
            })
        })

        return Object.values(coldefMap);
    }

    const innerCellRender = (rowdata: any, col: ColDef) => {
        const value: any = col.value? rowdata[col.value]:
            col.valueGetter? col.valueGetter(rowdata):
            col.cellRenderer? col.cellRenderer(rowdata):
            '';
        if (isEmpty(col.aslink)){
            return value;
        }else if (isEmpty(col.aslink?.to)){
            return (
                <a className='text-decor-none text-black' href={col.aslink?.to}
                >
                    {value}
                </a>
            );
        }else if(isEmpty(col.aslink?.hrefGetter)){
            return (
                <a className='text-decor-none text-black' href={(col.aslink?.hrefGetter || ((k)=> k))(rowdata.key || '')}
                >
                    {value}
                </a>
            );
        }else if (isEmpty(col.aslink?.handleClick)){
            return (
                <a className='text-decor-none text-black' href='#' 
                    onClick={(e) => {
                        e.preventDefault(); 
                        col.aslink?.handleClick? col.aslink.handleClick(rowdata.key): (()=>{})(); 
                    }}
                >
                    {value}
                </a>
            );
        }
        return value;
    }
    useEffect(()=>{
        if (isEmpty(props.colDef))
            setDefaultColDef(getDefaultColDef(props.data));
        
        setIndexedData(props.data.map(row => ({...row, _id: uniqueId()})));
        setSelectedRows([]);
    }, [props.data])
    return (
        <div>
            <table className='table'>
                <thead>
                    <tr>
                        {
                            (props.colDef || defaultColDef).map((col, index) => (
                                <th className={`col-header ${col.sortable? 'col-header-hover': ''}`} key={`header-${index}`} scope="col">
                                    <div className='d-flex flex-nowrap align-items-center '>
                                        <div>
                                            {col.hideLabel? '': col.label}
                                        </div>
                                        <div className='ms-auto' hidden={!col.sortable}>
                                            <BinaryAction 
                                                label='Sort' 
                                                bsIcon0='sort-up' 
                                                bsIcon1='sort-down' 
                                                handleClick={()=> {}} 
                                            />
                                        </div>
                                    </div>
                                    
                                </th>
                            ))
                        }
                        <th scope="col" hidden={isEmpty(props.actions)}>
                            
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        indexedData.map((rowdata, indexi)=>(
                            <tr key={`row-data-${indexi}`} 
                                className={`${props.rowClickable ? 'cursor-pointer': ''} ${selectedRows.findIndex(row => row._id === rowdata._id) >= 0? 'bg-select': 'bg-smoke-hover'}`}
                                onClick={()=>{
                                    if (props.rowClickable && props.actions){
                                        props.actions.handleAction(rowdata, {value: 'row-click'});
                                    }
                                    if (props.selectable){
                                        let newSelection: any[] = [];
                                        if (selectedRows.findIndex(row => rowdata._id === row._id) >=0 ){
                                            newSelection = selectedRows.filter(row => row._id !== rowdata._id);
                                        }else{
                                            if (props.multiselect){
                                                newSelection = [...selectedRows, rowdata];
                                            }else{
                                                newSelection = [rowdata];
                                            }
                                        }
                                        setSelectedRows(newSelection);
                                        if(props.onSelectionChange) props.onSelectionChange(newSelection);
                                    }
                                }}
                            >
                                {
                                    (props.colDef || defaultColDef).map((col, indexj) => (
                                        <td key={`cell-data-${indexi}${indexj}`}
                                            className={col.className?? (col.extraClasses?? '')}
                                        >
                                            {innerCellRender(rowdata, col)}
                                        </td>
                                    ))
                                }
                                <td>
                                    {
                                        props.actions?.layout === 'button'?(
                                            <div className='d-flex '>
                                                {
                                                    props.actions?.items.map((action, indexb)=> (
                                                        <div className='me-1' key={`action-button-${indexi}${indexb}`} style={{zIndex: 100}}>
                                                            <Button
                                                                label={action.label}
                                                                hideLabel={action.hideLabel}
                                                                extraClasses={action.buttonClasses??`btn-as-bg shadow-sm p-1 px-2`}
                                                                leftBsIcon={action.bsIcon}
                                                                handleClick={()=> {props.actions?.handleAction(rowdata, action)}}
                                                            />
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                        ):(
                                            <div className='action-dropdown' style={{zIndex: 1000}}>
                                                <DropdownAction 
                                                    actionCategory={[
                                                        {
                                                            label: 'Action',
                                                            value: 'action',
                                                            items: props.actions?.items || []
                                                        }
                                                    ]}
                                                    bsIcon='three-dots'
                                                    buttonClass='btn-as-bg p-1 px-2'
                                                    handleItemClick={(event: any)=> {props.actions?.handleAction(rowdata, event.item)}}
                                                />
                                            </div>
                                        )
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table;
