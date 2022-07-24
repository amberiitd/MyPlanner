import { FC, useState } from 'react';
import Select from '../../components/input/Select/Select';
import './WorkPage.css';

interface WorkPageProps{

}

const WorkPage: FC<WorkPageProps> = () => {
    const [value, setValue] = useState('');
    return (
        <div className='border'>
            <Select 
                label='Select label'
                data={[
                    {
                        label: 'Option 1',
                        value: 'value1'
                    },
                    {
                        label: 'Value 2',
                        value: 'value2'
                    },
                    {
                        label: 'Choice 3',
                        value: 'value3'
                    },
                ]}
                defaultSelectedValue='value3'
                disabled={true}
                handleSelect={(opt: any)=> {setValue(opt)}}
            />
        </div>
    )
};

export default WorkPage;