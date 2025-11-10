import React from "react";
import { Box, Typography } from "@mui/material";



const UsersPage: React.FC = () => {
    return (
        <Box sx={styles.container}>
            <Typography variant="h4" gutterBottom>
                Users Page
            </Typography>
            <Typography variant="body1" color="text.secondary">
                This is a placeholder page for users.
            </Typography>
        </Box>
    );
};


const styles = {
    container: {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    } as const,
};
export default UsersPage;

