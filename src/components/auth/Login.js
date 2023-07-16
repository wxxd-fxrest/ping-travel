import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import styled from "styled-components";

const Login = () => {
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
        <Container className="ComponentContainer">
            <p> 로그인을 진행해주세요. </p>
            <form onSubmit={onSubmit} className="ComponentForm">
                <input type="email"
                        name="email"
                        placeholder="이메일"
                        required 
                        value={email}
                        onChange={onChange} />
                <input type="password"
                        name="password"
                        placeholder="비밀번호"
                        required 
                        value={password}
                        onChange={onChange} />
                <button> 로그인 </button>
            </form>
        </Container>
    )
};

const Container = styled.div``;

export default Login; 