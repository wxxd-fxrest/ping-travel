import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import MainPingMap from "./MainPingMap";

const MainPing = ({id}) => {
    const [docData, setDocData] = useState([]);
    const [type, setType] = useState(false); 

    const getAbout = useCallback(async () => {
        const FeedCollection = query(
            collection(db, "MainPing", `${id}`, "about"), 
            orderBy("date"));
        onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setDocData(feedArray) ;
        });
    }, [id]);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    return (
        <div>
            <button onClick={(e) => {
                    e.preventDefault();
                    setType(!type);
                }}> 
                {type === true ? <p>리뷰</p> : <p>질문</p>} 
            </button>
            {docData.map((m, i) => (
                <MainPingMap key={i} docData={m} type={type}/>
            ))}
        </div>
    )
}

export default MainPing;