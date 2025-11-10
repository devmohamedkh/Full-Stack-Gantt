import { Button, Box } from '@mui/material';
import { NavLink, useLocation } from 'react-router';
import { useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import DrawerNav from './Drawer';

interface NavItemsProps {
    items?: { label: string; path: string }[];
}

const defaultNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Users', path: '/users' }
];

const ACTIVE_BG_COLOR = 'rgba(255,255,255,0.12)';

const NavItems = ({ items = defaultNavItems }: NavItemsProps) => {
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen((open) => !open);
    };

    if (isMobile) {
        return (
            <DrawerNav open={drawerOpen} handleDrawerToggle={handleDrawerToggle} items={defaultNavItems} />
        );
    }

    // Desktop view
    return (
        <Box sx={styles.box}>
            {items.map((item) => (
                <Button
                    key={item.label}
                    component={NavLink}
                    to={item.path}
                    sx={() => ({
                        ...styles.button,

                        ...(location.pathname === item.path && {
                            backgroundColor: ACTIVE_BG_COLOR,
                        }),
                    })}
                    end={item.path === '/'}
                >
                    {item.label}
                </Button>
            ))}
        </Box>
    );
};

const styles = {
    box: {
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 2,
        flexGrow: 1,
        ml: 2,
        bgcolor: 'rgba(0,0,0,0.08)',
        borderRadius: 2,
        py: 0.5,
        px: 0.5,
    },
    button: {
        color: '#fff',
        fontWeight: 500,
        textTransform: 'none',
        borderRadius: 2,
        transition: 'background 0.2s',
        '&:hover': {
            bgcolor: 'rgba(255,255,255,0.16)'
        }

    },
    listButton: {
        color: '#fff',
        borderRadius: 2,
        mb: 0.5,
        fontWeight: 500,
        transition: 'background 0.2s',
        '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: ACTIVE_BG_COLOR,
        },
        '&:hover': {
            bgcolor: 'rgba(255,255,255,0.16)',
        },
    },
};

export default NavItems;
