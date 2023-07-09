import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import Profile from "../profile/Profile.js";

const ProfileData = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext); 

    return (
        <div>
            {/* {myPingID.map((m, i) => (
                <Profile key={i} myPingID={m}/>
            ))} */}
            <Profile mainPing={mainPing}/>
        </div>
    )
};

export default ProfileData;