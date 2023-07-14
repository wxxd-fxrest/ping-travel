import { signOut } from "firebase/auth";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import FriendRequest from "../components/friend/FriendRequest";
import FriendSearchID from "../components/friend/FriendSearchID";
import { auth, db } from "../firebase";

const MenuBar = ({loginUserData, friendRequest, share}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const [requestAlert, setRequestAlert] = useState(false);
    let setOwnerUID ;

    console.log(share)
    return (
        <div>
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
                        setOwnerUID = s.ownerUID.split('@')[0];
                        return(
                            <div key={i}>
                                <p> 
                                    "{setOwnerUID}"(이)가 기록을 공유했습니다. 
                                    <button onClick={async() => {
                                        await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                                            shareAlert: arrayRemove(s),
                                        }); // 수락 시 요청 데이터 삭제 
                                    }}> 확인 </button>
                                </p>
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