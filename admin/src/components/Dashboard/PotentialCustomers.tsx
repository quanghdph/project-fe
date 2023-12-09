import * as React from 'react';
import Dashboard from '.';
import {Box, Flex} from '@chakra-ui/react';
import {currency} from 'src/helper/currencyPrice';
import {User} from 'src/types';
import Pagination from 'antd/es/pagination';
import {Card, Col, Divider, InputNumber, Row} from "antd";

interface PotentialCustomersProps {
    dashboard?: Dashboard
    money: number
    setMoney: (money: number) => void
}

const itemLimit = 1;

const PotentialCustomers = ({dashboard, money, setMoney}: PotentialCustomersProps) => {
    const [curPage, setCurPage] = React.useState(0);
    const [curItems, setCurItems] = React.useState<Array<{ _sum: { total_price: number }, user: User }>>([]);

    React.useEffect(() => {
        if (dashboard) {
            const offset = curPage * itemLimit;
            setCurItems(dashboard.potentialCustomers.slice(offset, offset + itemLimit));
        }
    }, [curPage, itemLimit, dashboard]);

    const onChange = (value: number | null) => {
        setMoney(value as number)
    };

    return (
        <React.Fragment>
            <Card title="Khách hàng tiềm năng">
                <Row>
                    <Col span={24}>
                        <InputNumber
                            value={money}
                            style={{width: "100%"}}
                            formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            onChange={onChange}
                        />
                    </Col>
                    <Divider/>
                    <Col span={24}>
                        {dashboard?.potentialCustomers && (
                            <React.Fragment>
                                <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"}
                                      justifyContent="space-between">
                                    <Box flex={1} fontWeight="bold">Tên</Box>
                                    <Box flex={1} fontWeight="bold">Email</Box>
                                    <Box flex={1} fontWeight="bold">Số tiền đã mua</Box>
                                </Flex>
                                {curItems.map((customer, index) => {
                                    return (
                                        <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"}
                                              justifyContent="space-between" key={index}>
                                            <Box flex={1}>{customer.user.first_name + customer.user.last_name}</Box>
                                            <Box flex={1}>{customer.user.email}</Box>
                                            <Box flex={1}>{currency(customer._sum.total_price)}</Box>
                                        </Flex>
                                    )
                                })}
                                <Flex justifyContent={'flex-end'} mt={4}>
                                    {dashboard && dashboard.potentialCustomers.length > 0 && (
                                        <Pagination
                                            defaultCurrent={1}
                                            total={dashboard.potentialCustomers.length}
                                            pageSize={itemLimit}
                                            onChange={(e: number) => {
                                                setCurPage(e - 1)
                                            }}
                                        />
                                    )}
                                </Flex>
                            </React.Fragment>
                        )}
                    </Col>
                </Row>
            </Card>
        </React.Fragment>
    );
};

export default PotentialCustomers;