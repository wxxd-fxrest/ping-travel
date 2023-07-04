import { useState } from "react";
import Login from "../components/auth/Login";
import SignUp from "../components/auth/SignUp";

const Auth = () => {
    const [open, setOpen] = useState(false); 

    return(
        <div>
            {open ? <div>
                <SignUp />
                <button onClick={() => {setOpen(!open)}}> 이미 계정이 있으신가요? </button>
            </div> : <div>
                <Login />
                <button onClick={() => {setOpen(!open)}}> 계정이 없다면 회원가입을 진행해주세요. </button>
            </div>}
        </div>
    )
}

export default Auth; 