import { UserOutlined } from '@ant-design/icons';
import { Box, Flex } from '@chakra-ui/react';
import { Card, Col, Row, Tooltip } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from 'src/app/hooks';

const UserOrderAddress = () => {
    const order = useAppSelector((state) => state.order);

    return (
        <Col span={12}>
            <Row gutter={[0, 12]}>
                <Col span={24}>
                    <Card title={
                        !order.single.loading && order.single.result ? (
                            <Flex alignItems={"center"}>
                                <UserOutlined />
                                <Link to={`customers/update/${order.single.result.users.id}`} style={{ marginLeft: "5px" }}>{order.single.result.users.first_name + order.single.result.users.last_name}</Link>
                            </Flex>
                        ) : null
                    }>
                        <Tooltip title={`Tuyến phố 1: ${!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_1 : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Tuyến phố 1: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_1 : null}
                            </p>
                        </Tooltip>
                        <Tooltip title={`Tuyến phố 2: ${!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_2 ? order.single.result.billing_address.street_line_2 : '-' : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Tuyến phố 2: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.street_line_2 ? order.single.result.billing_address.street_line_2 : '-' : null}
                            </p>
                        </Tooltip>
                        <Tooltip title={`Thành phố: ${!order.single.loading && order.single.result ? order.single.result.billing_address.city : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Thành phố: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.city : null}
                            </p>
                        </Tooltip>
                        <Tooltip title={`Quốc gia: ${!order.single.loading && order.single.result ? order.single.result.billing_address.country : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Quốc gia: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.country : null}
                            </p>
                        </Tooltip>
                        <Tooltip title={`Mã bưu điện: ${!order.single.loading && order.single.result ? order.single.result.billing_address.postal_code : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Mã bưu điện: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.postal_code : null}
                            </p>
                        </Tooltip>
                        <Tooltip title={`Tỉnh: ${!order.single.loading && order.single.result ? order.single.result.billing_address.province : null}`}>
                            <p style={{ width: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                <Box as="span" fontWeight="semibold">Tỉnh: </Box>{!order.single.loading && order.single.result ? order.single.result.billing_address.province : null}
                            </p>
                        </Tooltip>
                    </Card>
                </Col>
            </Row>
        </Col>
    );
};

export default UserOrderAddress;