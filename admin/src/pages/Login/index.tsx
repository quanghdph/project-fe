import * as React from 'react';
import { Col, Row, Button, Space, Form, Input, message } from 'antd';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import loginImage from 'src/assets/illustrations/dreamer.svg';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/features/auth/actions';
import { createAxiosClient } from "src/helper/axiosInstance";
import { Box, Flex } from '@chakra-ui/react';
import autoAnimate from '@formkit/auto-animate'


type Inputs = {
  username: string,
  password: string,
}

const LoginPage: React.FC = () => {

  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth.login);
  const accessToken = localStorage.getItem("accessToken")

  const navigate = useNavigate();

  const axiosClient = createAxiosClient();

  const { control, handleSubmit, setError, formState: { errors } } = useForm<Inputs>({
    defaultValues: {
      username: 'admin',
      password: '1'
    }
  });
  const onSubmit: SubmitHandler<Inputs> = async ({ username, password }) => {
    loginUser({ username, password }, dispatch, navigate, setError, axiosClient);
  };

  const usernameErrorRef = React.useRef(null);
  const passwordErrorRef = React.useRef(null);

  React.useEffect(() => {
    if (accessToken) {
      navigate('/dashboard')
    }
  }, [accessToken])

  React.useEffect(() => {
    usernameErrorRef.current && autoAnimate(usernameErrorRef.current);
    passwordErrorRef.current && autoAnimate(passwordErrorRef.current)
  }, [parent])

  return (
    <Flex minH="100vh" justifyContent="center" alignItems="center" background={"#1A2038"}>
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
                    name="username"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={usernameErrorRef}>
                          <Input placeholder='superadmin@gmail.com' {...field} />
                          {errors?.username ? <Box as="div" mt={1} textColor="red.600">{errors.username?.type === 'required' ? "Vui lòng điền username!" : errors.username.message}</Box> : null}
                        </div>
                      )
                    }}
                  />
                </Form.Item>
                <Form.Item label="Mật khẩu">
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => {
                      return (
                        <div ref={passwordErrorRef}>
                          <Input.Password {...field} />
                          {errors?.password ? <Box as="div" mt={1} textColor="red.600">{errors.password?.type === 'required' ? "Vui lòng điền mật khẩu!" : errors.password.message}</Box> : null}
                        </div>
                      )
                    }}
                  />
                </Form.Item>
                {
                  auth.loading ? <Button type="primary" loading>Đang tải...</Button> : <Button type='primary' htmlType='submit'>Đăng nhập</Button>
                }
              </Form>
            </Box>
          </Col>
        </Row>
      </Flex>
    </Flex>
  );
};

export default LoginPage;