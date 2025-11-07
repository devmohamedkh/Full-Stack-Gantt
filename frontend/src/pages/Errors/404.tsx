import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router";
import Header from "../../components/Header";



const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Header />
            <Box sx={styles.container}>
                <Typography sx={styles.code} variant="h1">
                    404
                </Typography>
                <Typography sx={styles.message} variant="h4" color="text.secondary">
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    The page you are looking for does not exist or has been moved.
                </Typography>
                <Button
                    variant="contained"
                    sx={styles.button}
                    onClick={() => navigate("/")}
                >
                    Go Home
                </Button>
            </Box>
        </>

    );
};


const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column" as const,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
    },
    code: {
        fontSize: "6rem",
        fontWeight: 800,
        color: "#1976d2",
        marginBottom: "0.5em",
        letterSpacing: "0.1em",
    },
    message: {
        marginBottom: 2,
    },
    button: {
        marginTop: "2em",
    },
};
export default NotFoundPage;
