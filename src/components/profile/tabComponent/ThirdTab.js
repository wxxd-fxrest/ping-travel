import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../../../firebase";
import Plan from "../../plan/Plan";

const ThirdTab = ({profileUser}) => {
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
            {planData.map((p, i) => (
                <Plan key={i} planData={p} profileUser={profileUser}/>
            ))}
        </Container>
    )
};

const Container = styled.div``;

export default ThirdTab;