import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const RecordSave = () => {
    const location = useLocation();
    const {currentUser} = useContext(AuthContext);
    const state = location.state;
    const navigate = useNavigate();

    const [text, setText] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [selected, setSelected] = useState([]);
    let checkName ; 
    let checkValue ;
    let shareUserData ;

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    const onClickSave = async () => {
        if(selected) {
            selected.forEach(async (data) => {
                // console.log(data)
                const q = query(
                    collection(db, "UserInfo"), 
                    where("ID", "==", `${data}`));
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach(async (doc) => {
                    shareUserData = doc.data()
                    console.log(shareUserData)
                    // console.log(doc.id, " => ", doc.data());
                    await addDoc(collection(db, "UserInfo", `${shareUserData.uid}`, "sharedRecords"), {
                        placeName: state.name, 
                        placeY: state.placey,
                        placeX: state.placex,
                        placeID: state.id,
                        placeNumber: state.phone,
                        placeAddress: state.address,
                        placeRoadAddress: state.roadAdrees,
                        record: text,
                        ownerRecord: currentUser.uid,
                    }); 
                });     
                await updateDoc(doc(db, "UserInfo", shareUserData.uid), {
                    shareAlert: arrayUnion({
                        ownerRecord: currentUser.email,
                        placeName: state.name, 
                        record: text,
                    })
                });   
            })
        }
        await addDoc(collection(db, "UserInfo", currentUser.uid, "record"), {
            placeName: state.name, 
            placeY: state.placey,
            placeX: state.placex,
            placeID: state.id,
            placeNumber: state.phone,
            placeAddress: state.address,
            placeRoadAddress: state.roadAdrees,
            record: text,
            selectFriend: selected,
        });
        navigate('/');
    };
    
    // console.log(state)

    useEffect(() => {
        const getLoginUserData = async () => {
            const docRef = doc(db, "UserInfo", `${currentUser.uid}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFriendList(docSnap.data().friendID);
                // console.log(docSnap.data())
            } else {
                console.log("No such document!");
            }
        };
        getLoginUserData();
    }, [currentUser.uid]);

    const handleSelect = (e) => {
        checkName = e.target.name;
        checkValue = e.target.checked; 
        console.log(checkValue, checkName);
        if(checkValue) {
            setSelected((prev) => [...prev, checkName]);
            return; 
        } else if(!checkValue && selected.includes(checkName)) {
            setSelected(selected.filter((item) => item !== checkName))
            return; 
        }
        return;
    };

    return (
        <div>
            <p> 장소 : {state.name} </p>
            <p> 함께 공유하고 싶은 사람이 있다면 선택하세요. </p>
            {friendList.map((f, i) => {
                return(
                    <div key={i}>
                        <input type="checkbox" 
                            id={f} 
                            name={f} 
                            onChange={handleSelect}/>
                        <label htmlFor={f}> {f} </label>
                    </div>
                )
            })}
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