import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const appBarStyle = {
  backgroundColor: "#02151D",
  color: "white",
  padding: "10px 20px",
  display: "flex",
  alignItems: "center",
  position: "relative",
};

const titleStyle = {
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: "2rem",
  fontWeight: "bold",
};

const linkTextStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold",
  fontSize: "1.5rem",
};

const drawerStyle = {
  backgroundColor: "#02151D",
  height: "100%", // Ensure it covers the full height
};

const SideMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  return (
    <div>
      <div style={appBarStyle}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <span style={titleStyle}>PocketChef</span>
      </div>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: drawerStyle, // Set the background color of the drawer
        }}
      >
        <div
          style={{
            width: 250,
            paddingTop: "20px",
            paddingLeft: "10px",
            backgroundColor: "#02151D",
            height: "100%", // Ensures it covers the full height
          }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {/* Applying bold typography using primaryTypographyProps */}
            <ListItem button component={Link} to="/">
              <ListItemText
                primary="Home"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
            <ListItem button component={Link} to="/preferences">
              <ListItemText
                primary="Preferences"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
            <ListItem button component={Link} to="/favorites">
              <ListItemText
                primary="Favorites"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
            <ListItem button component={Link} to="/history">
              <ListItemText
                primary="History"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
            <ListItem button component={Link} to="/settings">
              <ListItemText
                primary="Settings"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
          </List>
          <div style={{ position: "absolute", bottom: "20px", left: "30px" }}>
            <IconButton edge="start" color="inherit" aria-label="logout">
              <LogoutIcon sx={{ fontSize: 28, color: "white" }} />
              <span
                style={{
                  marginLeft: "8px",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                Logout
              </span>
            </IconButton>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SideMenu;
