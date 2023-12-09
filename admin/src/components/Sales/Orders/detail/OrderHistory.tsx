import { Col, Timeline } from 'antd';
import moment from 'moment';
import React from 'react';
import { useAppSelector } from 'src/app/hooks';

const OrderHistory = () => {
    const order = useAppSelector((state) => state.order);

    return (
        <Col span={12}>
            <Timeline>
                {!order.single.loading && order.single.result ? (
                    order.single.result.order_history.map((history, index) => {
                        return (
                            <Timeline.Item key={index}>{`${history.content} ${new Date(history.created_date).toISOString().substring(0, 10)} - ${moment(history.created_date).utc().format('HH:mm:ss')}`}</Timeline.Item>
                        )
                    })
                ) : ''}
            </Timeline>
        </Col>
    );
};

export default OrderHistory;