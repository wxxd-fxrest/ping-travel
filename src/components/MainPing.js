import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";

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
            console.log(feedArray)
        });
    }, [id]);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    const musicList = () => {
        let serchList = [] ; 
        console.log(docData)
        for(let i = 0; i < docData.length; i++) {
            serchList.push(
                <div key={i}>
                    {type === true ? <>
                        {docData[i].Data.type === "review" && <>
                        <h4>{docData[i].Data.about}</h4> </>}
                    </> : <>
                    {docData[i].Data.type === "question" && <>
                        <h4>{docData[i].Data.about}</h4> </>}
                    </>}
                </div>
            )
        }
        return serchList; 
    } ; 

    return (
        <div>
            <button onClick={(e) => {
                    e.preventDefault();
                    setType(!type);
                }}> 
                {type === true ? <p>리뷰</p> : <p>질문</p>} 
            </button>
            <h5> {musicList()} </h5>
        </div>
    )
}

export default MainPing;