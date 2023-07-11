import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const Friend = ({profileUser, friendID}) => {
    const {currentUser} = useContext(AuthContext);
    const navigate = useNavigate();

    const friendList = () => {
        let IDlist = [] ; 
        if(friendID) {
            for(let i = 0; i < friendID.length; i++) {
                IDlist.push(
                    <div key={i}>
                        <p> * {friendID[i]} 
                        {profileUser.uid !== currentUser.uid ? null : 
                            <button onClick={(e) => {
                                e.preventDefault();
                                navigate(`/profile/${friendID[i]}`);
                                window.location.reload() ;
                            }}> 친구 프로필 </button> }
                        </p>
                    </div>
                )
            }
            return IDlist; 
        } else {
            return; 
        }
    }; 

    return(
        <div style={{borderBottom: "solid 1px"}}>
            <h3> friendID </h3>
            {friendList()}
        </div>
    )
};

export default Friend;