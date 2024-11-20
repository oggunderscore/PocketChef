// This tooltip is not currently being used, should it be revived?
import React from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/Info";
import Fade from "@mui/material/Fade";

function InformationTooltip({ tooltipText }) {
  return (
    <Tooltip
      title={tooltipText}
      placement="right"
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 600 }}
      arrow
    >
      <InfoIcon style={{ color: "#12263E", cursor: "pointer" }} />
    </Tooltip>
  );
}

export default InformationTooltip;
