import { uniqueId } from 'lodash';
import React from 'react';
import { FC } from 'react';
import { SimpleAction } from '../../model/types';
import Badge from '../Badge/Badge';
import DropdownAction from '../DropdownAction/DropdownAction';
import LinkCard, { LinkItem } from '../LinkCard/LinkCard';
import './InfoCard.css';

interface InfoLinks{
    label: string;
    value: string;
    href: string;
    metric?: {
        count: number;
    }
}

interface InfoFooterAction{

}

interface InfoCardProps{
    title: string;
    titleHref?: string;
    caption?: string;
    links?: InfoLinks[];
    footerActions?: LinkItem[];
}

const InfoCard: FC<InfoCardProps> = (props) => {

    return (
        <div className='card-container position-relative border rounded-2'>
            <div className='position-absolute left-0 h-100 bg-thm left-border'>

            </div>
            <a className='py-2 position-absolute top-0 w-100 f-80 no-link' href={props.titleHref || '#'} style={{zIndex: 3}}>
                <div className='d-flex mx-1'>
                    <div className='px-2 py-1 border rounded bg-light'>
                        <i className='bi bi-lightning-charge' style={{fontSize: '150%'}}></i>
                    </div>
                    <div className='ms-2'>
                        <div className='fw-bold'>{props.title}</div>
                        <div className='text-muted'>{props.caption}</div>
                    </div>
                </div>
            </a>
            <div className='info-body overflow-auto ps-4 pe-2'>
                <React.Fragment>
                    <div className='py-1 ps-4 f-80' style={{fontWeight: 600}}>Quick links</div>
                    {
                        (props.links || []).map((link, index) => (
                            <a key={`info-card-link-${index}`} href={link.href} className='d-flex info-link f-80 py-1 ps-4 no-link'>
                                <div>{link.label}</div>
                                {
                                    link.metric &&
                                    <div className='ms-auto'>
                                        <Badge
                                            data={link.metric?.count || 0}
                                            extraClasses={`bg-thm`}
                                        />
                                    </div>
                                }
                            </a>
                        ))
                    }
                </React.Fragment >
            </div>

            <div className='position-absolute bottom-0 w-100 f-80'>
                <div className='d-flex align-items-center border-top ps-5 pe-2 py-1' style={{zIndex: 1}}>
                    <DropdownAction 
                        actionCategory={[{
                            label: 'Boards',
                            value: 'boards',
                            items: props.footerActions || []
                        }]} 
                        handleItemClick={()=>{}}
                        bsIcon={'caret-down'}
                        buttonText={`${props.footerActions?.length} board`}
                        buttonClass='btn-as-light p-1 px-2'
                        dropdownClass='right-0 f-75'
                    />
                </div>
            </div>

        </div>
    )
}

export default InfoCard;