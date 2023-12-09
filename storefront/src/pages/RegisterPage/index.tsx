import * as React from 'react';
import { Col, Row, Button, Form, Input } from 'antd';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import loginImage from 'src/assets/illustrations/dreamer.svg';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, useToast } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate'
import { createAxiosClient } from 'src/axios/axiosInstance';
import { registeUser } from 'src/features/auth/action';

type Inputs = {
    email: string
    password: string
    first_name: string
    last_name: string
}

const RegisterPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth.register);

    const navigate = useNavigate();

    const axiosClient = createAxiosClient();

    const { control, handleSubmit, setError, formState: { errors } } = useForm<Inputs>({
        defaultValues: {
            email: '',
            password: '',
            first_name: '',
            last_name: ''
        }
    });

    const toast = useToast()
    const emailErrorRef = React.useRef(null);
    const passwordErrorRef = React.useRef(null);
    const firstNameErrorRef = React.useRef(null);
    const lastNameErrorRef = React.useRef(null);

    React.useEffect(() => {
        emailErrorRef.current && autoAnimate(emailErrorRef.current);
        passwordErrorRef.current && autoAnimate(passwordErrorRef.current)
        firstNameErrorRef.current && autoAnimate(firstNameErrorRef.current);
        lastNameErrorRef.current && autoAnimate(lastNameErrorRef.current)
    }, [parent])

    const onSubmit: SubmitHandler<Inputs> = async ({ email, password, first_name, last_name }) => {
        registeUser({ email, password, first_name, last_name }, dispatch, navigate, setError, axiosClient, toast);
    };

    return (
        <Flex minH="100vh" justifyContent="center" alignItems="center" background={"#262b41"}>
            <Flex maxW={"800px"} height={"600px"} justifyContent={"center"} alignItems={"center"} borderRadius={"0.75rem"} my={"4px"} mx={"4px"} bg={"white"} textColor={"rgba(52, 49, 76, 1)"}>
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
                                <Form.Item label="First name">
                                    <Controller
                                        name="first_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={firstNameErrorRef}>
                                                    <Input placeholder='Quan' {...field} />
                                                    {errors?.first_name ? <Box as="div" mt={1} textColor="red.600">{errors.first_name?.type === 'required' ? "Please input your first name!" : errors.first_name.message}</Box> : null}
                                                </div>
                                            )
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="Last name">
                                    <Controller
                                        name="last_name"
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => {
                                            return (
                                                <div ref={lastNameErrorRef}>
                                                    <Input placeholder='superadmin@gmail.com' {...field} />
                                                    {errors?.last_name ? <Box as="div" mt={1} textColor="red.600">{errors.last_name?.type === 'required' ? "Please input your last name!" : errors.last_name.message}</Box> : null}
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
                                    auth.loading ? <Button type="primary" loading className='mb-2'>Loading...</Button> : <Button type='primary' htmlType='submit' className='mb-2'>Register</Button>
                                }
                            </Form>
                            <Link to="/login" className='underline cursor-pointer text-[gray] font-light'>Already have an account? Login here</Link>
                        </Box>
                    </Col>
                </Row>
            </Flex>
        </Flex>
    );
};

export default RegisterPage;