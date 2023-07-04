import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const Profile = () => {
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const location = useLocation() ;

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const [profileData, setProfileData] = useState([]) ; 
    console.log(pathUID)
    useEffect(() => {
        const ProfileUserInfo = async () => {
            const getUserData = query(
                collection(db, "UserInfo"), 
                where("ID", "==", `${pathUID}`));
            const querySnapshot = await getDocs(getUserData);
            querySnapshot.forEach((doc) => {
                setProfileData(doc.data());
                // console.log(profileData)
            }); 
        }; 
        ProfileUserInfo();
    }, [pathUID]);

    return (
        <div>
            <h3><img src={profileData.attachmentUrl} alt="#" width="100px" height="100px" style={{borderRadius:"100px"}}/>{profileData.ID}</h3>
        </div>
    )
};

export default Profile; 