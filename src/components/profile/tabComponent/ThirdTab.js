import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../../firebase";
import Plan from "../../plan/Plan";

const ThirdTab = ({profileUser, pathUID}) => {
    const [planData, setPlanData] = useState([]);

    useEffect(() => {
        const FeedCollection = query(
            collection(db, "UserInfo", `${profileUser.uid}`, "plan"));
          onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setPlanData(feedArray);
            // console.log(feedArray)
        });
    }, [profileUser.uid]);

    return (
        <Container>
            <div className={pathUID ? 'pathUIDhave' : 'pathUIDunHave'}>
                {planData.map((p, i) => (
                    <Plan key={i} planData={p} profileUser={profileUser}/>
                ))}
            </div>
        </Container>
    )
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    max-height: 90%; 
    overflow-y: scroll;
    -ms-overflow-style: none; 
    scrollbar-width: none; 
    &::-webkit-scrollbar {
        display: none;
    }
`;

export default ThirdTab;