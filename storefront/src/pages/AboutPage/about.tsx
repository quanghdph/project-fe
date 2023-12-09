import * as React from 'react';
import { useLocation } from 'react-router-dom';
import { BuilderComponent, builder } from '@builder.io/react'
import Loading from 'src/components/Loading';

builder.init(import.meta.env.VITE_BUILDERIO_KEY as string);
const AboutPage = () => {
    const [builderContentJson, setBuilderContentJson] = React.useState<BuilderComponent | undefined>();

    const location = useLocation();
    React.useEffect(() => {
        builder.get('page', { url: location.pathname })
            .promise().then(setBuilderContentJson)
    }, [location.pathname])
    return (
        <React.Fragment>
            <div className='mt-16'>
                {builderContentJson ? <BuilderComponent model="page" content={builderContentJson} /> : <Loading />}
            </div>
        </React.Fragment>
    )
};

export default AboutPage;