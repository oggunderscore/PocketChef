import React from 'react';
import InfoIcon from '@mui/icons-material/Info';

const InformationTooltip = ({ tooltipText}) => {
    return (
        <div className="information-tooltip">
            <InfoIcon/>
            <span className="information-tooltip-text">{tooltipText}</span>
        </div>
    );
};

export default InformationTooltip;