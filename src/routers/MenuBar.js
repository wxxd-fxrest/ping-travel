import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import FriendRequest from "../components/friend/FriendRequest";
import FriendSearchID from "../components/friend/FriendSearchID";

const MenuBar = ({loginUserData, friendRequest, share}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const [requestAlert, setRequestAlert] = useState(false);

    // console.log(share)
    return (
        <div style={{borderBottom: "solid 1px"}}>
            <h5 onClick={() => {
                setRequestAlert(!requestAlert)
            }}> 💡 </h5>
            {requestAlert === true ? <>
                <h5> 친구요청 </h5>            
                {friendRequest.length !== 0 ? <>
                    {friendRequest.map((f, i) => (
                        <FriendRequest key={i} friendRequest={f} loginUserData={loginUserData}/>
                    ))}
                </> : <p> 요청이 없습니다. </p>}
                <h5> 알림 </h5>            
                {share !== undefined ? <>
                    {share.map((s, i) => {
                        return(
                            <div key={i} style={{borderBottom: "solid 1px"}}>
                                <p> {s.alert} </p>
                                <h6> 장소: "{s.placeName}" </h6>
                                <button onClick={async() => {
                                    await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                                        shareAlert: arrayRemove(s),
                                    }); // 수락 시 요청 데이터 삭제 
                                    navigate(`/profile/${loginUserData.ID}`)
                                    window.location.reload() 
                                }}> 확인 </button>
                            </div>
                        )
                    })}
                </> : <p> 알림이 없습니다. </p>}
            </> : null }
            <button onClick={(e) => {
                e.preventDefault();
                navigate(`/profile/${loginUserData.ID}`)}}> 
                프로필
            </button>
            <button onClick={() => {
                signOut(auth) 
                navigate("/")
                alert("로그아웃 되었습니다.")}}> 
                로그아웃
            </button> 
            <FriendSearchID loginUserData={loginUserData}/>
        </div>
    )
};

export default MenuBar;