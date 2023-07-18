import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Record from "../../record/Record";
import styled from "styled-components";

const SecondTab = ({profileUser}) => {
    const [recordData, setRecordData] = useState([]);

    useEffect(() => {
        const FeedCollection = query(
            collection(db, "UserInfo", `${profileUser.uid}`, "record"));
          onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setRecordData(feedArray);
            // console.log(feedArray)
        });
    }, [profileUser.uid]);

    return (
        <Container>
            {recordData.map((r, i) => (
                <Record key={i} recordData={r} profileUser={profileUser}/>
            ))}
        </Container>
    )
};

const Container = styled.div`

`;

export default SecondTab;