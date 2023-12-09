import { Box, Flex } from '@chakra-ui/react';
import { Button, Card, Col, DatePicker, Divider, Pagination, Row, Tooltip } from 'antd';
import * as React from 'react';
import Dashboard from '.';
import { currency } from 'src/helper/currencyPrice';
import { Link } from 'react-router-dom';
import moment from 'moment';
import type { DatePickerProps } from 'antd';
import { Order } from 'src/types';

interface SalesReportProps {
   dashboard?: Dashboard
   setStartDate: (startDate: string) => void
   startDate: string
   setEndDate: (endDate: string) => void
}

const dateFormat = 'YYYY/MM/DD';

const itemLimit = 10;

const SalesReport = ({ dashboard, setStartDate, startDate, setEndDate }: SalesReportProps) => {
   const [curPage, setCurPage] = React.useState(0);
   const [curItems, setCurItems] = React.useState<Array<Order>>([]);

   React.useEffect(() => {
      if (dashboard) {
         const offset = curPage * itemLimit;
         setCurItems(dashboard.salesReport.slice(offset, offset + itemLimit));
      }
   }, [curPage, itemLimit, dashboard]);

   const onChangeStartDate: DatePickerProps['onChange'] = (date) => {
      setStartDate(moment(date)?.toISOString() as string)
   };

   const onChangeEndDate: DatePickerProps['onChange'] = (date) => {
      setEndDate(moment(date)?.toISOString() as string)
   };

   return (
      <Card title="Báo cáo bán hàng">
         <Row>
            <Col span={24}>
               <Flex mb={"14px"}>
                  <Flex flex={1} mr={4} alignItems="center">
                     <span style={{ marginRight: "8px" }}>Từ</span>
                     <DatePicker defaultValue={moment(startDate, dateFormat)} style={{ width: "100%" }} onChange={onChangeStartDate} />
                  </Flex>
                  <Flex flex={1} alignItems="center">
                     <span style={{ marginRight: "8px" }}>Đến</span>
                     <DatePicker style={{ width: "100%" }} onChange={onChangeEndDate} />
                  </Flex>
               </Flex>
               <Box as="p">Số lượng sản phẩm đã bán: <Box as="span" fontWeight="bold">{dashboard?.salesReport?.length ? dashboard?.salesReport.reduce((prev, current) => prev + current.quantity, 0) : 0}</Box></Box>
               <Box as="p">Tổng doanh thu (đã trả tiền): <Box as="span" fontWeight="bold" color="green">+{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.filter(({ payment }) => payment).reduce((prev, current) => prev + current.profit, 0)) : 0}</Box></Box>
               <Box as="p">Tổng doanh thu (chưa trả tiền): <Box as="span" fontWeight="bold" color="red">-{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.filter(({ payment }) => !payment).reduce((prev, current) => prev + current.profit, 0)) : 0}</Box></Box>
               <Box as="p">Tổng doanh thu: <Box as="span" fontWeight="bold">{dashboard?.salesReport?.length ? currency(dashboard?.salesReport.reduce((prev, current) => prev + current.profit, 0)) : 0}</Box></Box>
            </Col>
            <Divider />
            <Col span={24}>
               <React.Fragment>
                  <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between">
                     <Box flex={2} fontWeight="bold">Mã đơn hàng</Box>
                     <Box flex={1} fontWeight="bold">Giá</Box>
                     <Box flex={1} fontWeight="bold">Lợi nhuận</Box>
                     <Box flex={1} fontWeight="bold">Số lượng</Box>
                     <Box flex={1} fontWeight="bold">Phương thức thanh toán</Box>
                     <Box flex={1} fontWeight="bold"></Box>
                  </Flex>
                  {curItems.map((order, index) => {
                     return (
                        <Flex mb={2} padding={2} borderBottom={"1px solid #dbdbdb"} justifyContent="space-between" key={index}>
                           <Box flex={2}>
                              <Tooltip title={order.code}>
                                 <Box whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'} w={200}>{order.code}</Box>
                              </Tooltip>
                           </Box>
                           <Box flex={1}>{currency(order.total_price)}</Box>
                           <Box flex={1} color={order.payment ? 'green' : 'red'}>{currency(order.profit)}</Box>
                           <Box flex={1}>{order.quantity}</Box>
                           <Box flex={1}>{order.payment_method}</Box>
                           <Box flex={1}>
                              <Button>
                                 <Link to={`/sales/orders/detail/${order.id}`}>Open</Link>
                              </Button>
                           </Box>
                        </Flex>
                     )
                  })}
                  <Flex justifyContent={'flex-end'} mt={4}>
                     {dashboard && dashboard.salesReport.length > 0 && (
                        <Pagination
                           defaultCurrent={1}
                           total={dashboard.salesReport.length}
                           pageSize={itemLimit}
                           onChange={(e: number) => {
                              setCurPage(e - 1)
                           }}
                        />
                     )}
                  </Flex>
               </React.Fragment>
            </Col>
         </Row>
      </Card>
   );
};

export default SalesReport;