import React from 'react'
import Layout from '../Layout'

import { Link } from 'react-router-dom'

import Icon1 from '../../assets/icon-footer/icon-pay-01.png'
import Icon2 from '../../assets/icon-footer/icon-pay-02.png'
import Icon3 from '../../assets/icon-footer/icon-pay-03.png'
import Icon4 from '../../assets/icon-footer/icon-pay-04.png'
import Icon5 from '../../assets/icon-footer/icon-pay-05.png'

const Footer = () => {
    return (
        <footer className='bg-[#222] text-white pt-16 pb-6'>
            <div className='flex flex-row justify-between flex-wrap gap-3'>
                <div className='flex flex-col gap-y-9 w-[30%] lg:w-[30%] xl:w-[30%] md:w-[30%] sm:w-[30%]'>
                    <p className='font-bold text-xl uppercase'>Categories</p>
                    <ul className='flex flex-col gap-y-3'>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Women</Link>
                        </li>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Men</Link>
                        </li>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Shoes</Link>
                        </li>
                    </ul>
                </div>
                <div className='flex flex-col gap-y-9 lg:w-[30%] xl:w-[30%] md:w-[30%] sm:w-[30%]'>
                    <p className='font-bold text-xl uppercase'>Help</p>
                    <ul className='flex flex-col gap-y-3'>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Track Order</Link>
                        </li>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Returns</Link>
                        </li>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>Shipping</Link>
                        </li>
                        <li className='text-[#b2b2b2] text-sm'>
                            <Link to='#'>FAQs</Link>
                        </li>
                    </ul>
                </div>
                <div className='flex flex-col gap-y-9 lg:w-[30%] xl:w-[30%] md:w-[30%] sm:w-[30%]'>
                    <p className='font-bold text-xl uppercase'>Get in touch</p>
                    <ul className='flex flex-col gap-y-3'>
                        <li className='text-[#b2b2b2] text-sm'>
                            <p>Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='mt-9 text-sm text-[#b2b2b2] text-center'>
                <div className='flex flex-row justify-center mb-3'>
                    <img src={Icon1} alt="" />
                    <img src={Icon2} alt="" />
                    <img src={Icon3} alt="" />
                    <img src={Icon4} alt="" />
                    <img src={Icon5} alt="" />
                </div>
                <p>Copyright ©2023 All rights reserved | Made by Me</p>
            </div>
        </footer>
    )
}

export default Footer