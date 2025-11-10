import { Drawer, Box, List, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu';

interface DrawerNavProps {
    open: boolean;
    handleDrawerToggle: () => void;
    items: { label: string; path: string }[];
}

const ACTIVE_BG_COLOR = 'rgba(255,255,255,0.12)';

const DrawerNav = ({ open, handleDrawerToggle, items }: DrawerNavProps) => {
    const location = useLocation();
    return (

        <>
            <IconButton
                color="inherit"
                aria-label="open navigation menu"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ ml: 1 }}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="left"
                open={open}
                onClose={handleDrawerToggle}
                sx={{ '& .MuiDrawer-paper': { bgcolor: "#0b4176", color: "#fff" } }}
            >
                <Box
                    sx={{ width: 220, mt: 2 }}
                    role="presentation"
                    onClick={handleDrawerToggle}
                    onKeyDown={handleDrawerToggle}
                >
                    <List>
                        {items.map((item) => (
                            <ListItemButton
                                key={item.label}
                                component={NavLink}
                                to={item.path}
                                selected={location.pathname === item.path}
                                sx={{
                                    ...(location.pathname === item.path && {
                                        backgroundColor: ACTIVE_BG_COLOR,
                                    }),
                                }}
                            >
                                <ListItemText primary={item.label} sx={{ '.MuiTypography-root': { color: "#fff" } }} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </>

    );
};

export default DrawerNav;
