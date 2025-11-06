import { Box, Container } from '@mui/material';
import LOGIN_IMAGE_URL from '../../../assets/analytic.png';
import LoginForm from './LoginForm';



const Login = () => {
    return (
        <Container maxWidth="md" sx={styles.container}>
            <Box sx={styles.boxWrapper}>
                <Box sx={styles.imageBox}>
                    <img
                        src={LOGIN_IMAGE_URL}
                        alt="Login Visual"
                        style={styles.imageStyle}
                    />
                </Box>
                <Box sx={styles.formBox}>
                    <LoginForm />
                </Box>
            </Box>

        </Container>
    );
};


const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    boxWrapper: {
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: "center"
    },
    imageBox: {
        flex: 1,
        display: { xs: 'none', md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        mb: { xs: 4, md: 0 },
        pr: { md: 6 },
        width: { xs: '100%', md: '50%' }
    },
    imageStyle: {
        width: '100%',
        maxWidth: '360px',
        borderRadius: 16,
        objectFit: 'cover',
        boxShadow: '0 8px 32px rgba(0,0,0,.15)'
    },
    formBox: {
        flex: 1,
        width: { xs: '100%', md: '50%' },
        maxWidth: 400,
        mx: 'auto'
    }
};

export default Login;
