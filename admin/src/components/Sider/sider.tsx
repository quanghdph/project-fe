import * as React from 'react';
import { Layout, Menu } from 'antd';
import {
    UsergroupAddOutlined,
    UserOutlined,
    UserAddOutlined,
    PictureOutlined,
    FolderOpenOutlined,
    InboxOutlined,
    ShoppingCartOutlined,
    TagOutlined,
    BgColorsOutlined,
    FullscreenOutlined,
    UnorderedListOutlined,
    DeploymentUnitOutlined,
    ScissorOutlined,
    AlibabaOutlined,
    
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const SiderBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const items = React.useMemo<MenuProps['items']>(() => {
        return [
            {
                key: "dashboard",
                icon: "",
                label: "Bảng điều khiển",
                className: location.pathname === "/dashboard" ? "ant-menu-item-selected" : "",
                onClick: () => {
                    navigate('/dashboard')
                }
            },
            {
                key: "catalog",
                icon: "",
                label: "Quản lí sản phẩm",
                children: [
                    {
                        key: "products",
                        icon: <InboxOutlined />,
                        label: "Sản phẩm",
                        className: location.pathname === "catalog/products" ? "ant-menu-item-selected" : "",
                        onTitleClick: () => {
                            navigate('catalog/products')
                        },
                        children: [
                            {
                                key: "brands",
                                icon: <DeploymentUnitOutlined />,
                                label: "Thương hiệu",
                                className: location.pathname === "catalog/brands" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/brands')
                                }
                            },
                            {
                                key: "sizes",
                                icon: <FullscreenOutlined />,
                                label: "Kích thước",
                                className: location.pathname === "catalog/sizes" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/sizes')
                                }
                            },
                            {
                                key: "colors",
                                icon: <BgColorsOutlined />,
                                label: "Màu sắc",
                                className: location.pathname === "catalog/colors" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/colors')
                                }
                            },
                            {
                                key: "meterial",
                                icon: <ScissorOutlined />,
                                label: "Chất liệu",
                                className: location.pathname === "catalog/material" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/material')
                                }
                            },
                            {
                                key: "waistband",
                                icon: <AlibabaOutlined />,
                                label: "Cạp quần",
                                className: location.pathname === "catalog/waistbands" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/waistbands')
                                }
                            },
                            {
                                key: "categories",
                                icon: <UnorderedListOutlined />,
                                label: "Danh mục",
                                className: location.pathname === "catalog/categories" ? "ant-menu-item-selected" : "",
                                onClick: () => {
                                    navigate('catalog/categories')
                                }
                            },
                        ]
                    }
                ]
            },
            {
                key: "sales",
                icon: "",
                label: "Bán hàng",
                onClick: () => {
                    navigate('/sales/orders')
                }
                // children: [
                //     {
                //         key: "orders",
                //         icon: <ShoppingCartOutlined />,
                //         label: "Đơn hàng",
                //         className: location.pathname === "sales/orders" ? "ant-menu-item-selected" : "",
                //         onClick: () => {
                //             navigate('sales/orders')
                //         }
                //     },
                //     {
                //         key: "bills",
                //         icon: <ShoppingCartOutlined />,
                //         label: "Hóa đơn",
                //         className: location.pathname === "sales/bills" ? "ant-menu-item-selected" : "",
                //         onClick: () => {
                //             navigate('sales/bills')
                //         }
                //     },
                // ]
            },
            {
                key: "employee",
                icon: "",
                label: "Quản lý nhân viên",
                children: [
                    {
                        key: "employee-sub",
                        icon: <UserOutlined />,
                        label: "Nhân viên",
                        className: location.pathname === "/employee" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('/employee')
                        }
                    },
                ]
            },
            {
                key: "customers",
                icon: "",
                label: "Khách hàng",
                children: [
                    {
                        key: "customers-sub",
                        icon: <UserOutlined />,
                        label: "Khách hàng",
                        className: location.pathname === "/customers" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('/customers')
                        }
                    },
                ]
            },
            {
                key: "settings",
                icon: "",
                label: "Cài đặt",
                children: [
                    {
                        key: "administrators",
                        icon: <UserAddOutlined />,
                        label: "Quản trị viên",
                        className: location.pathname === "settings/administrators" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('settings/administrators')
                        }
                    },
                    {
                        key: "roles",
                        icon: <UsergroupAddOutlined />,
                        label: "Vai trò",
                        className: location.pathname === "settings/roles" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('settings/roles')
                        }
                    },
                ]
            },
        ]
    }, [location.pathname])

    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="vertical"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
            />
        </Sider>
    );
};

export default SiderBar;