import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { collection, onSnapshot, query } from "firebase/firestore";
import Record from "../../record/Record";
import styled from "styled-components";

const SecondTab = ({profileUser, pathUID}) => {
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
            <div className={pathUID ? 'pathUIDhave' : 'pathUIDunHave'}>
                {recordData.map((r, i) => (
                    <Record key={i} recordData={r} profileUser={profileUser}/>
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

export default SecondTab;