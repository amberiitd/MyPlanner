import { isEmpty } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import ButtonCircle from '../../../../../../components/ButtonCircle/ButtonCircle';
import CircleRotate from '../../../../../../components/Loaders/CircleRotate';
import { User } from '../../../../../../model/types';

interface PeopleInputProps {
  label: string;
  hideLabel?: boolean;
  value: string;
  placeholder?: string;
  hidePlaceholder?: boolean;
  isRequired?: boolean;
  rightBsIcon?: string;
  focus?: boolean;
  error?: string;
  loading?: boolean;
  selectedPeople?: User;
  onBlur?: (e: any)=> void;
  handleChange: (value: string)=> void;
}

const PeopleInput: FC<PeopleInputProps> = (props) => {
  const [active, setActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const compRef = useRef<HTMLDivElement>(null);
  const [selectedPeople, setSelectedPeople] = useState(props.selectedPeople);
  useEffect(()=>{
    if(inputRef.current && props.focus){
        inputRef.current.focus();
    }        
  }, [props])

  useEffect(() =>{
    setSelectedPeople(props.selectedPeople);
  }, [props.selectedPeople, active])

  useEffect(()=> {
    const handleWindowClick = (e: any) => {
        if(compRef && compRef.current && compRef.current.contains(e.target)){
            if (inputRef && inputRef.current){
                inputRef.current.focus();
                inputRef.current?.select();
                setActive(true);
            }
        }
        else{
        }
    };

    document.addEventListener('click', handleWindowClick, true);

    return () => {
        document.removeEventListener('click', handleWindowClick, true);
    }
  }, [])
  return (
    <div ref={compRef} className="" data-testid="TextInput">
      <div className='' hidden={!!props.hideLabel}>
        {props.label}<span className='text-thm ms-1' style={{fontSize: 'small'}}>{props.isRequired? '*': ''}</span>
      </div>
      <div className={`d-flex flex-nowrap people-input-container border rounded-1 ${active ? 'focus-thm': 'bg-light'}`}
      >
        <ButtonCircle
            label={props.selectedPeople?.fullName.split(' ').map(p => p[0]).join('') || 'P'}
            showLabel={!!props.selectedPeople && props.selectedPeople.fullName === props.value}
            bsIcon={'person-fill'}
            disabled
            style={{cursor: 'default'}}
            size='sm'
            onClick={()=>{}}
        />
        <input 
            ref={inputRef}
            className="bg-transparent people-input ms-1" 
            type="text" 
            placeholder={!!props.hidePlaceholder? '': active? (props.placeholder?? 'Enter Value'): ''} 
            value ={selectedPeople?.fullName || props.value} 
            onChange={(e)=> {props.handleChange(e.target.value); setSelectedPeople(undefined)}} 
            onFocus={()=> {setActive(true)}}
            onBlur={(e)=> {setActive(false); (props.onBlur|| (()=> {}))(e)}}
        />
        {
            props.loading &&
            <CircleRotate loading={true}   
                size='sm'
            />
        }
      </div>
      {
        !isEmpty(props.error) &&
        <div className='text-danger px-1 f-80'>
            {props.error}
        </div>
      }
    </div>
  )
  };

export default PeopleInput;
