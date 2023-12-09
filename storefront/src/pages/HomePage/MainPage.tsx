import React, { Fragment } from 'react';
import ProductBy from 'src/components/ProductBy';
import Slider from 'src/components/Slider/slider';

const MainPage = () => {
    return (
        <Fragment>
            <Slider />
            <div className='px-10 py-8'>
                <ProductBy title='New arrivals' url="product/new-arrivals" />
                <ProductBy title='Most bought' url="product/most-bought"/>
            </div>
        </Fragment>
    );
};

export default MainPage;