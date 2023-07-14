import { collection, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import Home from "../../routers/Home";
import Profile from "../profile/Profile.js";

const ProfileData = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext); 
    const location = useLocation() ;

    const [profileUser, setProfileUser] = useState([]);
    const [friendID, setFriendID] = useState([]);

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);


    useEffect(() => {
        const getLoginUserData = async() => {
            const q = query(
                collection(db, "UserInfo"), 
                where("ID", "==", `${pathUID}`));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setProfileUser(doc.data());
                setFriendID(doc.data().friendID);
                console.log(doc.id, " => ", doc.data());
            });        
        };
        getLoginUserData();
    }, [currentUser.uid, pathUID]); 

    return (
        <div>
            <Profile mainPing={mainPing} profileUser={profileUser} friendID={friendID}/>
        </div>
    )
};

export default ProfileData;