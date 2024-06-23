import React from 'react';
import { Typography } from 'antd';
import '../../index.css';
import backgroundImage from '../../assets/img_homepage.jpeg';
import { SignIn, SignedOut } from '@clerk/clerk-react';  // Import the SignIn component

const Home: React.FC = () => {
    return (
        <div className="homepage my-16" style={{ backgroundImage: `url(${backgroundImage})`, marginTop: '0px' }}>
            <div className="overlay">
                <Typography.Title className="overlay-text text-center text-white" level={2}>Welcome to WissensWerk!</Typography.Title>
                
                {/* <div className="text-center mt-10">
                    <Image src={logo} className='block' width={200} preview={false} />
                </div> */}
                <SignedOut>
                    <div className="sign-in-container">
                        <SignIn redirectUrl={"/answer-forms"} /> 
                    </div>
                </SignedOut>
            </div>
        </div>
    );
};


export default Home;
