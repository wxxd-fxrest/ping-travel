import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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
        <div>
            {planData.map((p, i) => (
                <Plan key={i} planData={p} profileUser={profileUser}/>
            ))}
        </div>
    )
};

export default ThirdTab;