import { isEmpty, startCase } from 'lodash';
import { FC, useEffect, useState } from 'react';
import { Type } from 'typescript';
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
        to: string;
    }
}

export interface SimpleAction{
    label: string;
    value: string;
}

export interface RowAction{
    items: SimpleAction[];
    layout?: 'button' | 'dropdown';
    handleAction: (rowdata: any, event: any) => void;
}

interface TableProps{
    colDef?: ColDef[];
    data: any[];
    actions?: RowAction
}

const Table: FC<TableProps> = (props) => {
    const [defaultColDef, setDefaultColDef] = useState<ColDef[]>([]);
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

        return isEmpty(col.aslink) ? value : (
            <a href='#'>
            {value}
            </a>
        );
    }
    useEffect(()=>{
        if (isEmpty(props.colDef))
            setDefaultColDef(getDefaultColDef(props.data));
    }, [props.data])
    return (
        <div>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        {
                            (props.colDef || defaultColDef).map((col, index) => (
                                <th className={`col-header ${col.sortable? 'col-header-hover': ''}`} key={`header-${index}`} scope="col">
                                    <div className='d-flex flex-nowrap'>
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
                        props.data.map((rowdata, indexi)=>(
                            <tr key={`row-data-${indexi}`}>
                                {
                                    (props.colDef || defaultColDef).map((col, indexj) => (
                                        <td key={`cell-data-${indexi}${indexj}`}>
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
                                                        <div className='me-1' key={`action-button-${indexi}${indexb}`}>
                                                            <Button
                                                                label={action.label}
                                                                extraClasses='btn-as-bg shadow-sm px-2 py-1'
                                                                handleClick={()=> {props.actions?.handleAction(rowdata, action)}}
                                                            />
                                                        </div>
                                                        
                                                    ))
                                                }
                                            </div>
                                        ):(
                                            <div className='action-dropdown'>
                                                <DropdownAction 
                                                    menuItems={props.actions?.items || []} 
                                                    bsIcon='three-dots'
                                                    dropdownClass='btn-as-bg p-1'
                                                    handleItemClick={(event: any)=> {props.actions?.handleAction(rowdata, event)}}
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
