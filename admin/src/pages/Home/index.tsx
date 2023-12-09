import * as React from 'react';
import { Col, Layout, Menu, Row } from 'antd';
import logo from 'src/assets/logo/logo.png';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from 'src/app/hooks';
import { logOut } from 'src/features/auth/actions';
import { useNavigate } from 'react-router-dom';
import { createAxiosJwt } from "src/helper/axiosInstance";
import SiderBar from 'src/components/Sider/sider';

const { Header, Content } = Layout;

const HomePage = () => {

    const navigate = useNavigate();

    const currentUser = useAppSelector((state) => state.auth.login);

    const dispatch = useAppDispatch();

    const axiosClientJwt = createAxiosJwt();

    const handleLogout = () => {
        logOut(dispatch, navigate, axiosClientJwt)
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ backgroundColor: "white", position: "relative", zIndex: 10, boxShadow: "0 2px 8px #f0f1f2" }}>
                <Row justify='start' align='middle' style={{ height: "100%" }} >
                    <Col span={4}>
                        <Link to='/dashboard'>
                            <img src={logo} alt='Logo' />
                        </Link>
                    </Col>
                    <Col span={20}>
                        <Menu mode="horizontal" style={{ border: 0, justifyContent: "end" }}>
                            <Menu.SubMenu key="info-user" title={`Xin chào, ${!currentUser.loading && currentUser.result && currentUser.result.first_name} ${!currentUser.loading && currentUser.result && currentUser.result.last_name}`}>
                                <Menu.Item key="home" onClick={() => navigate('/dashboard')}>
                                    Trang chủ
                                </Menu.Item>
                                <Menu.Item key="logout" onClick={handleLogout}>
                                    Đăng xuất
                                </Menu.Item>
                            </Menu.SubMenu>
                        </Menu>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <SiderBar />
                <Content style={{ padding: '1.5rem', minHeight: 280 }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default HomePage;