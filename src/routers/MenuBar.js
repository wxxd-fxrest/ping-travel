import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import FriendRequest from "../components/friend/FriendRequest";
import FriendSearchID from "../components/friend/FriendSearchID";
import ReviewQuestion from "../components/ReviewQuestion";
import ProfileData from "../components/profile/ProfileData";

const MenuBar = ({mainPing}) => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const [requestAlert, setRequestAlert] = useState(false);

    const [loginUserData, setLoginUserData] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [share, setShare] = useState([]);
    const [tab, setTab] = useState(0);

    const getLoginUserData = useCallback(async () =>  {
        if(currentUser.uid) {
            const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
            setLoginUserData(docSnap.data());
            setFriendRequest(docSnap.data().friendRequest);
            setShare(docSnap.data().shareAlert);
            // console.log(docSnap.data())
            } else {
            console.log("No such document!");
            }
        } else {
            return;
        }
    }, [currentUser.uid]);

    useEffect(() => {
        getLoginUserData();
    }, [currentUser.uid, getLoginUserData]);

    // console.log(share)
    return (
        <div>
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
                <button onClick={() => {
                    signOut(auth) 
                    navigate("/")
                    alert("로그아웃 되었습니다.")}}> 
                    로그아웃
                </button> 
                <FriendSearchID loginUserData={loginUserData}/>
            </div>
            <div>
                <h3 onClick={() => setTab(0)}> 🧸 Profile </h3>
                <h3 onClick={() => setTab(1)}> 🧸 Home </h3>
            </div>
            {tab === 0 && <>
                <h4 style={{color:"green", margin: "10px"}}> Profile </h4>
                <ProfileData mainPing={mainPing} loginUserData={loginUserData}/>
            </>}
            {tab === 1 && <>
                <h4 style={{color:"green", margin: "10px"}}> Home </h4>
                <ReviewQuestion mainPing={mainPing} />
            </>}
        </div>
    )
};

export default MenuBar;