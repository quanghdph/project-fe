import * as React from 'react';
import notFoundImage from 'src/assets/illustrations/404.svg';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Box, Flex } from '@chakra-ui/react';
const NotFoundPage = () => {
    const navigate = useNavigate();
    return (
        <Flex w="100%" h="100vh" justifyContent="center" alignContent="center">
            <Flex maxW="320px" justifyContent="center" alignItems="center" flexDirection="column">
                <Box as="img" w="100%" mb={8} src={notFoundImage} alt='404-image' />
                <Button type="primary" size='large' onClick={() => navigate(-1)}>Go Back</Button>
            </Flex>
        </Flex>
    );
};

export default NotFoundPage;