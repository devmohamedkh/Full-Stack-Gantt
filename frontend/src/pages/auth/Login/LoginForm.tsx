import { useState } from 'react';
import { Box, Button, TextField, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../../context';
import { LoaderWithErrorHandling } from '../../../components/LoaderWithErrorHandling';


interface LoginFormValues {
    email: string;
    password: string;
}

const initialValues: LoginFormValues = {
    email: '',
    password: '',
};

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    password: Yup.string()
        .required('Required'),
});

const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const { login, loading } = useAuth()


    const handleLogin = async (
        values: LoginFormValues,
        { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
    ) => {
        setLoginError(null);
        try {
            await login(values.email, values.password)
        } catch {
            setLoginError('Login failed. Please try again.');
        }
        setSubmitting(false);
    };

    return (
        <>
            <Typography variant="h4" sx={{ mb: 2, textAlign: 'center' }}>
                Login
            </Typography>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ isSubmitting, errors, touched, handleBlur }) => (
                    <Form>
                        <Box sx={{ mb: 2 }}>
                            <Field
                                as={TextField}
                                label="Email"
                                name="email"
                                type="email"
                                fullWidth
                                required
                                autoComplete="email"
                                error={touched.email && Boolean(errors.email)}
                                helperText={touched.email && errors.email}
                                onBlur={handleBlur}
                            />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                            <Field
                                as={TextField}
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                fullWidth
                                required
                                autoComplete="current-password"
                                error={touched.password && Boolean(errors.password)}
                                helperText={touched.password && errors.password}
                                onBlur={handleBlur}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword((show) => !show)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                        </Box>
                        {loginError && (
                            <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                                {loginError}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                            size='large'
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
                )}
            </Formik>

            <LoaderWithErrorHandling loading={loading} />
        </>

    );
};

export default LoginForm;
