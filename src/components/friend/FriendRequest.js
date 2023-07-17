import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import { arrayRemove, arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import styled from "styled-components";

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
            window.location.reload();
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
            window.location.reload();
        }
    };

    return(
        <Container>
            <li className="friendRequestContainer"> 
                <p> {friendRequest} </p>
                <button onClick={onClickAccept}> 수락 </button> 
                <button onClick={onClickRefuse}> 거절 </button> 
            </li>
        </Container>
    )
};

const Container = styled.div`
    .friendRequestContainer {
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: flex-start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-top: 5px;
        margin-bottom: 15px;
        padding: 10px;
        p {
            color: white;
            margin: 5px;
        }
        button {
            width: 100%;
            height: 25px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 10px;
            font-weight: bold;
            margin-top: 10px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;

export default FriendRequest;