import React, { useState } from "react";
import styled from "styled-components";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";
import AuthBackImg from '../img/ping-travel-auth-background.jpeg';

const Auth = () => {
    const [open, setOpen] = useState(false); 

    return(
        <Container>
            <img src={AuthBackImg} alt="#" />
            {open ? <div className="authComponent"> 
                <SignUp setOpen={setOpen} open={open}/>
            </div> : <div className="authComponent">
                <Login setOpen={setOpen} open={open}/>
            </div>}
        </Container>
    )
};

const Container = styled.div`
    background-color: #D4F4FA;
    position: relative;
    display: flex;
    text-align: start;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
        img {
            filter: brightness(55%);
            display: flex;
            width: 100vw;
            height: 100vh;
        }
        .authComponent {
            position: absolute;
            display: inline-block;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 30px;
            width: 300px;
        }
`;

export default Auth; 