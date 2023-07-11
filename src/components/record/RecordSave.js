import { addDoc, collection } from "firebase/firestore";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const RecordSave = () => {
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);
    const state = location.state;
    const navigate = useNavigate();

    const [text, setText] = useState("");

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    const onClickSave = async () => {
        await addDoc(collection(db, "UserInfo", currentUser.uid, "record"), {
            placeName: state.name, 
            placeY: state.placey,
            placeX: state.placex,
            placeID: state.id,
            placeNumber: state.phone,
            placeAddress: state.address,
            placeRoadAddress: state.roadAdrees,
            record: text,
        });
        navigate('/');
    }
    
    console.log(state)

    return (
        <div>
            <p> 장소 : {state.name} </p>
            <input type="text" 
                    name="text"
                    placeholder="내용을 입력해주세요" 
                    value={text} 
                    onChange={onChange}/>
            <button type="button" onClick={onClickSave}> ok </button>
        </div>
    )
};

export default RecordSave;