import * as React from 'react';
import { Col, Row, Button, Space, Form, Input } from 'antd';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import loginImage from 'src/assets/illustrations/dreamer.svg';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, useToast } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate'
import { createAxiosClient } from 'src/axios/axiosInstance';
import { loginUser } from 'src/features/auth/action';

type Inputs = {
    email: string,
    password: string,
}

const LoginPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth.login);

    const navigate = useNavigate();

    const axiosClient = createAxiosClient();

    const { control, handleSubmit, setError, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: ''
        }
    });

    const toast = useToast()
    const emailErrorRef = React.useRef(null);
    const passwordErrorRef = React.useRef(null);

    React.useEffect(() => {
        emailErrorRef.current && autoAnimate(emailErrorRef.current);
        passwordErrorRef.current && autoAnimate(passwordErrorRef.current)
    }, [parent])

    const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
        loginUser({ email, password }, dispatch, navigate, setError, axiosClient, toast);
    };

    return (
        <Flex minH="100vh" justifyContent="center" alignItems="center" background={"#262b41"}>
            <Flex maxW={"800px"} height={"400px"} justifyContent={"center"} alignItems={"center"} borderRadius={"0.75rem"} my={"4px"} mx={"4px"} bg={"white"} textColor={"rgba(52, 49, 76, 1)"}>
                <Row>
                    <Col span={12}>
                        <Flex px={8} py={8} h={"100%"} justifyContent={"center"} alignItems={"center"} minW={"320px"}>
                            <img src={loginImage} alt='Login Image' width='100%' />
                        </Flex>
                    </Col>
                    <Col span={12}>
                        <Box height={"100%"} px={8} py={8} bg={"rgba(0,0,0,0.01)"}>
                            <Form
                                onFinish={handleSubmit(onSubmit)}
                                layout='vertical'
                                autoComplete="off"
                            >
                                <Form.Item label="Email">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={emailErrorRef}>
                                                    <Input placeholder='superadmin@gmail.com' {...field} />
                                                    {errors?.email ? <Box as="div" mt={1} textColor="red.600">{errors.email?.type === 'required' ? "Please input your email!" : errors.email.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Password">
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={passwordErrorRef}>
                                                    <Input.Password {...field} />
                                                    {errors?.password ? <Box as="div" mt={1} textColor="red.600">{errors.password?.type === 'required' ? "Please input your password!" : errors.password.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                {
                                    auth.loading ? <Button type="primary" loading className='mb-2'>Loading...</Button> : <Button type='primary' htmlType='submit' className='mb-2'>Login</Button>
                                }
                            </Form>
                            <Link to="/register" className='underline cursor-pointer text-[gray] font-light'>New customer? Create your account</Link>
                        </Box>
                    </Col>
                </Row>
            </Flex>
        </Flex>
    );
};

export default LoginPage;