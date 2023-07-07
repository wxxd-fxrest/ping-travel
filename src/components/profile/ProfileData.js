import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import Profile from "../profile/Profile.js";

const ProfileData = ({mainPing}) => {
    const {currentUser} = useContext(AuthContext); 
    const [myPing, setMyPing] = useState([]);

    console.log(mainPing)

    return (
        <div>
            {/* {mainPing.map((m, i) => (
                <Profile key={i} mainPing={m}/>
            ))} */}
            <Profile mainPing={mainPing}/>
        </div>
    )
};

export default ProfileData;