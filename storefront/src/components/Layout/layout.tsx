import React from 'react'

type LayoutProps = {
  children: React.ReactNode; // 👈️ type children
};

const Layout = (props: LayoutProps) => {
  return (
    <div className='mt-16 py-16 px-8 min-h-screen mx-auto 2xl:max-w-screen-2xl xl:max-w-screen-xl lg:max-w-screen-lg lg:justify-center md:max-w-screen-md sm:max-w-screen-sm'>
      {props.children}
    </div>
  )
}

export default Layout
