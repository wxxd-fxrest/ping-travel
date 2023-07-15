/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import { arrayRemove, collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import MapComponent from "../MapComponent";
import Friend from "./Friend";
import FirstTab from "./tabComponent/FirstTab";
import SecondTab from "./tabComponent/SecondTab";
import ThirdTab from "./tabComponent/ThirdTab";

// import MARKER from '../../img/marker.png';
// import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = ({profileUser, friendID}) => {
    // const location = useLocation() ;

    // const pathname = location.pathname ; 
    // const pathUID = (pathname.split('/')[2]);
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);

    const [tab, setTab] = useState(0);
    const [myPingID, setMyPingID] = useState([]);

    useEffect(() => {
        const FeedCollection = query(
            collection(db, "UserInfo", `${profileUser.uid}`, "about"));
          onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setMyPingID(feedArray);
            // console.log(feedArray)
        });
    }, [profileUser.uid]);
    
    const onOrganize = async(e) => {
        e.preventDefault();
        let currentUserID = currentUser.email.split('@')[0];
        const request = window.confirm("친구를 끊겠습니까?"); 
        if(request) {
            await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                friendID: arrayRemove(profileUser.ID),
            }); // 수락 시 요청 데이터 삭제 
            await updateDoc(doc(db, "UserInfo", profileUser.uid), {
                friendID: arrayRemove(currentUserID),
            }); // 수락 시 요청 데이터 삭제 
            alert("정리 되었습니다."); 
            navigate(`/profile/${currentUserID}`);
        }
    };

    return (
        <div>
            {/* <button onClick={(e) => {
                    e.preventDefault();
                    navigate('/')}}> 
                Home
            </button> */}
            <h3 style={{borderBottom: "solid 1px"}}>
                <img src={profileUser.attachmentUrl} alt="#" width="100px" height="100px" style={{borderRadius:"100px"}}/>
                {profileUser.ID}
                {profileUser.uid === currentUser.uid ? null : 
                    <button onClick={onOrganize}> 친구 정리 </button>}
            </h3>

            <Friend profileUser={profileUser} friendID={friendID}/>
                
            <div>
                <h3 onClick={() => setTab(0)}> tab 1 </h3>
                <h3 onClick={() => setTab(1)}> tab 2 </h3>
                <h3 onClick={() => setTab(2)}> tab 3 </h3>
            </div>

            {tab === 0 && <>
                <h4 style={{color:"green", margin: "10px"}}> 여행 기록 (with. friend) </h4>
                <button onClick={() => navigate('/record/search')}> 기록하기 </button>
                <SecondTab profileUser={profileUser}/>
            </>}
            {tab === 1 && <>
                <h4 style={{color:"green", margin: "10px"}}> 여행 계획 (with. friend) </h4>
                <button onClick={() => navigate('/plan/search')}> 계획하기 </button>
                <ThirdTab profileUser={profileUser} />
            </>}
            {tab === 2 && <>
                <h4 style={{color:"green", margin: "10px"}}> 내가 남긴 질문/리뷰 </h4>
                <MapComponent />
                <FirstTab myPingID={myPingID} profileUser={profileUser}/>
            </>}
        </div>
    )
};

export default Profile; 