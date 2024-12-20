import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Tooltip from "@mui/material/Tooltip";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  fontSize: "2.25rem",
  fontWeight: "bold",
  color: "white",
  textDecoration: "none", // Ensures it looks like a title and not a traditional link
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
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.info("You have been signed out.", { position: "top-right" });
        // navigate("/login");
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { position: "top-right" });
      });
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <ToastContainer />
      <div style={appBarStyle}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
        >
          <MenuIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Link to="/" style={titleStyle}>
          PocketChef
        </Link>
      </div>
      <Drawer
        anchor="left"
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: drawerStyle,
        }}
      >
        <div
          style={{
            width: 250,
            paddingTop: "10px",
            paddingLeft: "10px",
            backgroundColor: "#02151D",
            height: "100%",
          }}
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List dense>
            <ListItem button component={Link} to="/">
              <ListItemText
                primary="Home"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
            {/* <ListItem button component={Link} to="/preferences">
              <ListItemText
                primary="Preferences"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem> */}
            <Tooltip
              title={user ? "" : "You must be logged in to access this"}
              arrow
              placement="right"
            >
              <div>
                <ListItem
                  button={!!user}
                  component={user ? Link : "div"}
                  to={user ? "/favorites" : undefined}
                  style={{ pointerEvents: user ? "auto" : "none" }}
                >
                  <ListItemText
                    primary="Favorites"
                    primaryTypographyProps={{
                      ...linkTextStyle,
                      color: user ? "white" : "gray",
                    }}
                  />
                </ListItem>
              </div>
            </Tooltip>
            <Tooltip
              title={user ? "" : "You must be logged in to access this"}
              arrow
              placement="right"
            >
              <div>
                <ListItem
                  button={!!user}
                  component={user ? Link : "div"}
                  to={user ? "/history" : undefined}
                  style={{ pointerEvents: user ? "auto" : "none" }}
                >
                  <ListItemText
                    primary="History"
                    primaryTypographyProps={{
                      ...linkTextStyle,
                      color: user ? "white" : "gray",
                    }}
                  />
                </ListItem>
              </div>
            </Tooltip>
            <ListItem button component={Link} to="/settings">
              <ListItemText
                primary="Settings"
                primaryTypographyProps={linkTextStyle}
              />
            </ListItem>
          </List>
          <div style={{ position: "absolute", bottom: "20px", left: "30px" }}>
            {user ? (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="logout"
                onClick={handleLogout}
              >
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
            ) : (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="login"
                onClick={handleLoginClick}
              >
                <LoginIcon sx={{ fontSize: 28, color: "white" }} />
                <span
                  style={{
                    marginLeft: "8px",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  Login
                </span>
              </IconButton>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SideMenu;
