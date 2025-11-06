import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Circles } from "react-loader-spinner";
import { toast } from "react-toastify";

interface LoaderWithErrorHandlingProps {
    loading: boolean;
    error?: string | null;
    children?: React.ReactNode;
    loaderText?: string;
    style?: React.CSSProperties;
}

export const LoaderWithErrorHandling: React.FC<LoaderWithErrorHandlingProps> = ({
    loading,
    error,
    loaderText,
    style,
}) => {

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    return loading && (
        <Box
            position="fixed"
            top={0}
            left={0}
            width="100vw"
            height="100vh"
            zIndex={99999}
            bgcolor="background.default"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            style={{
                ...style,
                opacity: 0.85  // Add opacity here
            }}
        >
            <Circles
                height="60"
                width="60"
                color="#60C0E0"
                ariaLabel="circles-loading"
                visible={true}
            />
            <Typography variant="subtitle1" sx={{ mt: 2 }} color="text.secondary">
                {loaderText}
            </Typography>
        </Box>
    );
};
