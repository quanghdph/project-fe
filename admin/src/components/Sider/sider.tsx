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
    TagOutlined
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
                        onClick: () => {
                            navigate('catalog/products')
                        }
                    },
                    {
                        key: "categories",
                        icon: <FolderOpenOutlined />,
                        label: "Danh mục",
                        className: location.pathname === "catalog/categories" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('catalog/categories')
                        }
                    },
                    {
                        key: "assets",
                        icon: <PictureOutlined />,
                        label: "Ảnh",
                        className: location.pathname === "catalog/assets" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('catalog/assets')
                        }
                    },
                ]
            },
            {
                key: "sales",
                icon: "",
                label: "Bán hàng",
                children: [
                    {
                        key: "orders",
                        icon: <ShoppingCartOutlined />,
                        label: "Đơn hàng",
                        className: location.pathname === "sales/orders" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('sales/orders')
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
                key: "marketing",
                icon: "",
                label: "Tiếp thị",
                children: [
                    {
                        key: "promotions",
                        icon: <TagOutlined />,
                        label: "Khuyến mãi",
                        className: location.pathname === "/marketing/promotions" ? "ant-menu-item-selected" : "",
                        onClick: () => {
                            navigate('/marketing/promotions')
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
        <Sider width={300} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                style={{ height: '100%', borderRight: 0 }}
                items={items}
            />
        </Sider>
    );
};

export default SiderBar;