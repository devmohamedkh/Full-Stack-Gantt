import React from 'react';
import { Box, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type NoDataFoundProps = {
    message?: string;
    show?: boolean;
};

const NoDataFound: React.FC<NoDataFoundProps> = ({
    message = "No data found.",
    show = false,
}) => {
    if (!show) return null;

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
            width="100%"
            flexDirection="column"
            data-testid="no-data-found"
            gap={2}
        >
            <InfoOutlinedIcon color="action" sx={{ fontSize: 48 }} />
            <Typography variant="h6" color="text.secondary">
                {message}
            </Typography>
        </Box>
    );
};

export default NoDataFound;
