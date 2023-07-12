import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const FriendRequest = ({friendRequest, loginUserData}) => {
    const {currentUser} = useContext(AuthContext); 
    const [requestUserData, setRequestUserData] = useState([]);
    // console.log(friendRequest);
    // console.log(loginUserData);

    useEffect(() => {
        const get = async () => {
            const q = query(
                collection(db, "UserInfo"), 
                where("ID", "==", `${friendRequest}`));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setRequestUserData(doc.data());
                console.log(doc.id, " => ", doc.data());
            });
        };
        get();
    }, [friendRequest]);

    const onClickAccept = async (e) => {
        e.preventDefault();
        const request = window.confirm("요청을 수락하시겠습니까?"); 
        if(request) {
            await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                friendID: arrayUnion(friendRequest),
            }); // 수락 시 내 데이터 베이스에 상대방 추가
            await updateDoc(doc(db, "UserInfo", requestUserData.uid), {
                friendID: arrayUnion(loginUserData.ID)
            }); // 수락 시 상대 데이터 베이스에 나(login햔 user) 추가
            await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                friendRequest: arrayRemove(friendRequest),
            }); // 수락 시 요청 데이터 삭제 
            alert("수락 되었습니다."); 
        }
    };
    
    const onClickRefuse = async (e) => {
        e.preventDefault();
        const request = window.confirm("요청을 거절하시겠습니까?"); 
        if(request) {
            await updateDoc(doc(db, "UserInfo", currentUser.uid), {
                friendRequest: arrayRemove(friendRequest),
            }); // 거절 시 요청 데이터 삭제 
            alert("거절 되었습니다."); 
        }
    };

    return(
        <ul>
            <li> 
                {friendRequest} 
                <button onClick={onClickAccept}> 수락 </button> 
                <button onClick={onClickRefuse}> 거절 </button> 
            </li>
        </ul>
    )
};

export default FriendRequest;