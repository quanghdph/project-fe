import * as React from 'react';
import Footer from 'src/components/Footer/footer';
import Header from 'src/components/Header/header';
import { Outlet } from 'react-router-dom';

const HomePage = () => {
    return (
        <React.Fragment>
            <Header />
                <Outlet />
            {/* <Footer /> */}
        </React.Fragment>
    );
};

export default HomePage;