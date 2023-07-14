import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import Home from "../../routers/Home";
import MenuBar from "../../routers/MenuBar";
import Profile from "../profile/Profile.js";

const ProfileData = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext); 
    const location = useLocation() ;

    const [profileUser, setProfileUser] = useState([]);
    const [friendID, setFriendID] = useState([]);
    const [loginUserData, setLoginUserData] = useState([]);
    const [friendRequest, setFriendRequest] = useState([]);
    const [share, setShare] = useState([]);

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);

    useEffect(() => {
        const getLoginUserData = async () => {
            if(currentUser.uid) {
                const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                setLoginUserData(docSnap.data());
                setFriendRequest(docSnap.data().friendRequest);
                setShare(docSnap.data().shareAlert);
                console.log(docSnap.data())
                } else {
                console.log("No such document!");
                }
            }else {
                return;
            }
        };
        getLoginUserData();
    }, [currentUser.uid]);


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
    }, [pathUID]); 

    return (
        <div>
            <MenuBar friendRequest={friendRequest} loginUserData={loginUserData} share={share} />
            <Profile mainPing={mainPing} profileUser={profileUser} friendID={friendID}/>
        </div>
    )
};

export default ProfileData;