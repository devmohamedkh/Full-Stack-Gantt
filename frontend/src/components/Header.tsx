import {
    AppBar,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';

import { Avatar, IconButton, Menu, MenuItem, Typography as MuiTypography, Box } from '@mui/material';
import { useState, type MouseEvent } from 'react';



function Header() {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));


    const USERNAME = "John Doe";

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleAvatarClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSignOut = () => {
        handleMenuClose();

    };


    return (
        <AppBar position="static" elevation={0}>
            <Toolbar sx={styles.toolbar}>
                <Typography
                    variant={isMobile ? "h6" : "h5"}
                    component="div"
                    sx={styles.title}
                >
                    PROJECT MANAGEMENT
                </Typography>

                <Box sx={{ ml: { xs: 0, md: 2 } }}>
                    <IconButton
                        onClick={handleAvatarClick}
                        size="small"
                        sx={{ ml: 2, }}
                        aria-controls={open ? 'user-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                            {USERNAME.split(' ').map(word => word[0]).join('').toUpperCase()}
                        </Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        PaperProps={{
                            elevation: 10,
                            sx: {
                                mt: 1.5,
                                minWidth: 180,
                            },
                        }}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                    >
                        <MenuItem disabled>
                            <MuiTypography variant="subtitle1" color="text.primary">
                                {USERNAME}
                            </MuiTypography>
                        </MenuItem>
                        <MenuItem onClick={handleSignOut}>
                            <MuiTypography color="error">
                                Sign Out
                            </MuiTypography>
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

const styles = {
    toolbar: {
        gap: { xs: 2, md: 0 },
    },
    title: {
        fontWeight: 700,
        mb: { xs: 1, md: 0 },
        width: { xs: '100%', md: 'auto' },
        mr: { xs: 0, md: 'auto' },
    },
};

export default Header;
