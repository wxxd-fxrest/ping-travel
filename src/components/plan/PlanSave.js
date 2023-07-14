import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const PlanSave = () => {
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
    let shareUserDocID ; 

    let ownerUserID ;
    let ownerUserDocID; 

    let shareID = state.state;
    console.log(state.state)

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

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    const onClickSave = async () => {
        if(state.addPathDocID) {
            shareID = shareID.share; 
            // 기록 추가 시 데이터 저장 
            if(shareID) {
                shareID.forEach(async (data) => {
                    // console.log(data)
                    const q = query(
                        collection(db, "UserInfo"), 
                        where("ID", "==", `${data}`));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        shareUserData = doc.data()
                        // console.log(shareUserData.uid)
                        console.log(doc.id, " => ", doc.data());
                    });     
                    const e = query(
                        collection(db, "UserInfo", shareUserData.uid, "plan"), 
                        where("placeID", "==", `${state.state.placeID}`),
                        where("placeX", "==", `${state.state.placeX}`),
                        where("placeY", "==", `${state.state.placeY}`),
                        where("ownerUID", "==", `${currentUser.uid}`),
                        );
                    const querySnapshot2 = await getDocs(e);
                    querySnapshot2.forEach(async (doc) => {
                        shareUserDocID = doc.id; 
                        // console.log(shareUserDocID)
                        console.log(doc.id, " => ", doc.data());
                    });  
                    await updateDoc(doc(db, "UserInfo", shareUserData.uid, "plan", shareUserDocID), {
                        addPlan: arrayUnion({
                            placeName: state.name, 
                            placeY: state.placey,
                            placeX: state.placex,
                            placeID: state.id,
                            placeNumber: state.phone,
                            placeAddress: state.address,
                            placeRoadAddress: state.roadAdrees,
                            plan: text,
                        })
                    });   
                })
            } else {
                const docRef = doc(db, "UserInfo", `${currentUser.uid}`, "plan", `${state.addPathDocID}`);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    ownerUserID = docSnap.data(); 
                    console.log(docSnap.data())
                } else {
                    console.log("No such document!");
                }

                const e = query(
                    collection(db, "UserInfo", ownerUserID.ownerUID, "plan"), 
                    where("placeID", "==", `${state.state.placeID}`),
                    where("placeX", "==", `${state.state.placeX}`),
                    where("placeY", "==", `${state.state.placeY}`),
                    );
                const querySnapshot2 = await getDocs(e);
                querySnapshot2.forEach(async (doc) => {
                    ownerUserDocID = doc.id; 
                    console.log(doc.id, " => ", doc.data());
                });  
                await updateDoc(doc(db, "UserInfo", ownerUserID.ownerUID, "plan", ownerUserDocID), {
                    addPlan: arrayUnion({
                        placeName: state.name, 
                        placeY: state.placey,
                        placeX: state.placex,
                        placeID: state.id,
                        placeNumber: state.phone,
                        placeAddress: state.address,
                        placeRoadAddress: state.roadAdrees,
                        plan: text,
                    })
                });   
            }
            await updateDoc(doc(db, "UserInfo", currentUser.uid, "plan", state.addPathDocID), {
                addPlan: arrayUnion({
                    placeName: state.name, 
                    placeY: state.placey,
                    placeX: state.placex,
                    placeID: state.id,
                    placeNumber: state.phone,
                    placeAddress: state.address,
                    placeRoadAddress: state.roadAdrees,
                    plan: text,
                })
            });
        } 
        else {
            // 초기 기록 업로드 시 데이터 저장 
            if(selected) {
                selected.forEach(async (data) => {
                    // console.log(data)
                    const q = query(
                        collection(db, "UserInfo"), 
                        where("ID", "==", `${data}`));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach(async (doc) => {
                        shareUserData = doc.data()
                        // console.log(shareUserData)
                        // console.log(doc.id, " => ", doc.data());
                        await addDoc(collection(db, "UserInfo", `${shareUserData.uid}`, "plan"), {
                            placeName: state.name, 
                            placeY: state.placey,
                            placeX: state.placex,
                            placeID: state.id,
                            placeNumber: state.phone,
                            placeAddress: state.address,
                            placeRoadAddress: state.roadAdrees,
                            plan: text,
                            ownerUID: currentUser.uid,
                        }); 
                    });     
                    await updateDoc(doc(db, "UserInfo", shareUserData.uid), {
                        shareAlert: arrayUnion({
                            ownerUID: currentUser.email,
                            placeName: state.name, 
                            record: text,
                        })
                    });   
                })
            }
            await addDoc(collection(db, "UserInfo", currentUser.uid, "plan"), {
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
                placeID: state.id,
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                plan: text,
                selectFriend: selected,
            });
        }
        navigate('/');
    };
    
    // console.log(state)

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
            <p> 함께 계획하고 싶은 사람이 있다면 선택하세요. </p>
                {shareID === undefined && <>
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
                </>}

            <input type="text" 
                    name="text"
                    placeholder="내용을 입력해주세요" 
                    value={text} 
                    onChange={onChange}/>
            <button type="button" onClick={onClickSave}> ok </button>
        </div>
    )
};

export default PlanSave;