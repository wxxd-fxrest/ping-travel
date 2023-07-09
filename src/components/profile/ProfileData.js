import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import Profile from "../profile/Profile.js";

const ProfileData = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext); 
    const [myPingID, setMyPingID] = useState([]);

    // console.log(mainPing)

    // let myPing;
    // mainPing.forEach((data) => {
    //     // setMyPing(data.DocID)
    //     myPing = data.DocID
    //     console.log(myPing)
    // })
    // useEffect(() => {
        // const FeedCollection = query(
        //     collection(db, "UserInfo"),
        //     where("uid", "==", `${currentUser.uid}`));
        //   onSnapshot(FeedCollection, (querySnapshot) => {
        //     let feedArray = []
        //     querySnapshot.forEach((doc) => {
        //         feedArray.push({
        //             DocID: doc.id, 
        //             Data: doc.data(),
        //         })
        //     });
        //     console.log(feedArray);
        // });


        // const ProfileUserInfo = async () => {
        //     const getUserData = query(
        //         collection(db, "MainPing", `${myPing}`, "about"));
        //     const querySnapshot = await getDocs(getUserData);
        //     querySnapshot.forEach((doc) => {
        //         console.log(doc.data());
        //     }); 
        // }; 
        // ProfileUserInfo();
    // }, [currentUser.uid]);

    useEffect(() => {
        const getMyPostID = async () => {
            const getUserData = query(
                collection(db, "UserInfo"), 
                where("uid", "==", `${currentUser.uid}`));
            const querySnapshot = await getDocs(getUserData);
                querySnapshot.forEach((doc) => {
                    setMyPingID(doc.data().postID);
                }); 
        }; 
        getMyPostID();
    }, [currentUser.uid]);

    return (
        <div>
            {/* {mainPing.map((m, i) => (
                <Profile key={i} mainPing={m}/>
            ))} */}
            <Profile mainPing={mainPing} myPingID={myPingID}/>
        </div>
    )
};

export default ProfileData;