import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineUserCircle } from "react-icons/hi2";

const Login = ({setOpen, open}) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");

    const onChange = (event) => {
        const {target : {name, value}} = event; 
        if (name === "email") {
            setEmail(value) ;
        } else if (name === "password") {
            setPassword(value); 
        }
    }; 

    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password) ;
            navigate("/");
            console.log("로그인 완료"); 
        } catch (error) {
            switch (error.code) {
                case "auth/user-not-found" || "auth/wrong-password":
                  return alert("이메일 혹은 비밀번호가 일치하지 않습니다.");
                case "auth/email-already-in-use":
                  return alert("이미 사용 중인 이메일입니다.");
                case "auth/weak-password":
                  return alert("비밀번호는 6글자 이상이어야 합니다.");
                case "auth/network-request-failed":
                  return alert("네트워크 연결에 실패 하였습니다.");
                case "auth/invalid-email":
                  return alert("잘못된 이메일 형식입니다.");
                case "auth/internal-error":
                  return alert("잘못된 요청입니다.");
                default:
                  return alert("로그인에 실패 하였습니다.");
            };
        }
    }; 

    return(
        <Container>
            <div className="logo">
                <h3> Ping Travel </h3>
                <div className='logoBar' />
            </div>
            <form onSubmit={onSubmit}>
                <div className="loginInput">
                    <HiOutlineUser size="18px" style={{color:"rgba(255, 255, 255, 0.9)", position:"absolute", top:"21px", left:"25px"}} />
                    <input type="email"
                        name="email"
                        placeholder="이메일"
                        required 
                        value={email}
                        onChange={onChange} />
                </div>
                <div className="loginInput">
                    <HiOutlineLockClosed size="18px" style={{color:"rgba(255, 255, 255, 0.9)", position:"absolute", top:"21px", left:"25px"}} />
                    <input type="password"
                        name="password"
                        placeholder="비밀번호"
                        required 
                        value={password}
                        onChange={onChange} />
                </div>
                <button> Log In </button>
                <div className="transform">
                    <h3 className="authTransform"> 계정이 없다면 회원가입을 진행해주세요. ▸▸ </h3>
                    <HiOutlineUserCircle size="30px" className="transformIcon"
                        onClick={() => {setOpen(!open)}}/>
                </div>
            </form>
        </Container>
    )
};

const Container = styled.div`
    position: relative;
    text-align: center;
    align-items: center;
    justify-content: center;
    height: 350px;
    width: 300px;
    .transform {
        display: flex;
        text-align: center;
        align-items: center;
        justify-content: end;
        margin-bottom: 25px;
        .authTransform {
            font-size: 12px;
            margin-right: 5px;
            color: white;
        }
        .transformIcon {
            color: rgba(255, 255, 255, 0.7);
            margin-right: 10px;
            margin-left: 3px;
            cursor: pointer;
            &:hover {
                color: rgba(0, 150, 138);
            }
        }
    }
    .logo {
        background-color: rgba(255, 255, 255, 0.1);
        display: inline-flex;
        width: 100px;
        height: 100px;
        border-radius: 100%;
        border: 1px solid rgba(255, 255, 255, 0.2);
        text-align: center;
        align-items: center;
        justify-content: center;
        position: relative;
        .logoBar {
            position: absolute;
            display: flex;
            width: 100%;
            height: 100%;
            text-align: center;
            align-items: center;
            justify-content: center;
            border-left: 2.5px solid rgb(195, 96, 57);
            border-radius: 100%;
            animation: rotate_image 6s ease-in-out infinite;
            transform-origin: 50% 50%;
            @keyframes rotate_image{
                100% {
                    transform: rotate(360deg);
                }
            }
        }
        h3 {
            font-size: 0.9rem;
            font-weight: 100;
            color: white;
            &::first-letter {
                font-size: 2.1rem;
                letter-spacing: -8.5px;
            }
        }
    }
    form {
        margin-top: 25px;
        text-align: center;
        align-items: center;
        justify-content: center;
        .loginInput {
            position: relative;
            input {
                width: 60%;
                height: 38px;
                margin-top: 10px;
                border-radius: 50px;
                border: none;
                background-color: rgba(255, 255, 255, 0.5);
                /* background-color: rgba(255, 255, 255); */
                padding-left: 50px;
                padding-right: 50px;
                color: rgba(255, 255, 255, 0.9);
                outline: none;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.4);
                }
                &::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                &:focus {
                    background-color: rgba(255, 255, 255, 0.4);
                }
            }
        }
        button {
            width: 95%;
            height: 40px;
            margin-top: 10px;
            margin-bottom: 10px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.75);
            color: white;
            font-size: 15px;
            font-weight: bold;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138, 0.9);
            }
        }
    }
`;

export default Login; 