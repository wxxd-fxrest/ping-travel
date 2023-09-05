import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import BackButton from "../modal/BackButton";
import styled from "styled-components";
import { HiOutlineMap } from "react-icons/hi2";

const PlanSave = () => {
    const {currentUser} = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    const [text, setText] = useState("");
    const [friendList, setFriendList] = useState([]);
    const [selected, setSelected] = useState([]);

    let checkName; 
    let checkValue;

    let shareUserData;
    let shareUserDocID; 

    let ownerUserID;
    let ownerUserDocID; 

    let currentUserID;

    let shareID = state.state;
    // console.log(state.state)

    let timestamp = Date.now();
    let date = new Date(timestamp);
    let saveDate = (
        date.getFullYear()+ "년 "+
        (date.getMonth()+1)+ "월 " +
        date.getDate()+ "일 " +
        date.getHours()+ ":"+ 
        date.getMinutes());

    // console.log(saveDate);

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
        const {target : {name, value}} = event; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    const onClickSave = async () => {
        currentUserID = `${currentUser.email}`.split('@')[0];
        // console.log('state => ', state)
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
                        console.log('shareUserData', shareUserData)
                        // console.log('querySnapshot =>', doc.id, " => ", doc.data());
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
                        // console.log('querySnapshot2 =>', doc.id, " => ", doc.data());
                    });  

                    await updateDoc(doc(db, "UserInfo", shareUserData.uid, "plan", shareUserDocID), {
                        addPlan: arrayUnion({
                            addDate: saveDate,
                            addPlaceName: state.name, 
                            addPlaceY: state.placey,
                            addPlaceX: state.placex,
                            addPlaceID: state.id,
                            addPlaceNumber: state.phone,
                            addPlaceAddress: state.address,
                            addPlaceRoadAddress: state.roadAdrees,
                            addPlan: text,
                            writeUID: currentUser.uid
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
                    collection(db, "UserInfo", ownerUserID.writeUID, "plan"), 
                        where("placeID", "==", `${state.state.placeID}`),
                        where("placeX", "==", `${state.state.placeX}`),
                        where("placeY", "==", `${state.state.placeY}`),
                    );
                const querySnapshot2 = await getDocs(e);
                querySnapshot2.forEach(async (doc) => {
                    ownerUserDocID = doc.id; 
                    // console.log('ownerUserDocID =>', doc.id, " => ", doc.data());
                });  
                await updateDoc(doc(db, "UserInfo", ownerUserID.writeUID, "plan", ownerUserDocID), {
                    addPlan: arrayUnion({
                        addDate: saveDate,
                        addPlaceName: state.name, 
                        addPlaceY: state.placey,
                        addPlaceX: state.placex,
                        addPlaceID: state.id,
                        addPlaceNumber: state.phone,
                        addPlaceAddress: state.address,
                        addPlaceRoadAddress: state.roadAdrees,
                        addPlan: text,
                        writeUID: currentUser.uid
                    })
                });   
            }
            await updateDoc(doc(db, "UserInfo", currentUser.uid, "plan", state.addPathDocID), {
                addPlan: arrayUnion({
                    addDate: saveDate,
                    addPlaceName: state.name, 
                    addPlaceY: state.placey,
                    addPlaceX: state.placex,
                    addPlaceID: state.id,
                    addPlaceNumber: state.phone,
                    addPlaceAddress: state.address,
                    addPlaceRoadAddress: state.roadAdrees,
                    addPlan: text,
                    writeUID: currentUser.uid
                })
            });
        } else {
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
                            date: saveDate,
                            placeName: state.name, 
                            placeY: state.placey,
                            placeX: state.placex,
                            placeID: state.id,
                            placeNumber: state.phone,
                            placeAddress: state.address,
                            placeRoadAddress: state.roadAdrees,
                            plan: text,
                            writeUID: currentUser.uid,
                            ownerID: currentUserID, 
                        }); 
                    });     
                    await updateDoc(doc(db, "UserInfo", shareUserData.uid), {
                        shareAlert: arrayUnion({
                            date: saveDate,
                            ownerUID: currentUser.uid,
                            ownerEmail: currentUser.email, 
                            ownerID: currentUserID, 
                            placeName: state.name, 
                            alert: `${currentUserID}(이)의 계획 공유`
                        })
                    });   
                })
            }
            await addDoc(collection(db, "UserInfo", currentUser.uid, "plan"), {
                date: saveDate,
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
                placeID: state.id,
                placeNumber: state.phone,
                placeAddress: state.address,
                placeRoadAddress: state.roadAdrees,
                plan: text,
                selectFriend: selected,
                writeUID: currentUser.uid,
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
        <Container>
            <div className='searchHeaderContainer'>
                <BackButton /> 
                <div className='searchHeader'>
                    <HiOutlineMap size="35px" className='searchIcon' />
                    <h4> 함께 계획하고 싶은 사람이 있다면 선택하세요. </h4>
                </div>
            </div>

            <div className="recordSaveBody">
                <div className="recordSaveText">
                    <div className="recordText">
                        <h4> 장소 :</h4> 
                        <p> '{state.name}' </p>
                    </div>
                    <div className="recordSaveContainer">
                        <textarea type="text" 
                            name="text"
                            placeholder="내용을 입력해주세요" 
                            value={text} 
                            onChange={onChange}
                            className="recordInput"/>
                        <button type="button" onClick={onClickSave}> ok </button>
                    </div>
                </div>

                {!shareID && <div className="checkBox">
                    <h4> 친구 목록 </h4>
                    {friendList.map((f, i) => {
                        return(
                            <div key={i} className="friendCheck">
                                <input type="checkbox" 
                                    id={f} 
                                    name={f} 
                                    onChange={handleSelect}/>
                                <label htmlFor={f}> {f} </label>
                            </div>
                        )
                    })}
                </div>}
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: white;
    width: 50vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    border: solid 0.01rem rgb(250, 117, 65, 0.85);
    border-radius: 10px;
    @media screen and (max-width: 800px) {
        width: 80vw;
    }
    .searchHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: rgb(250, 117, 65, 0.85);
        }
        .searchHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
                color:  rgb(250, 117, 65, 0.85);
            }
            h4 {
                font-size: 17px;
                color:  rgb(250, 117, 65, 0.85);
            }
        }
        @media screen and (max-width: 500px) {
            display: flex;
            flex-direction: column;
            position: relative;
            .searchHeader {
                margin-top: 10px;
            }
        }
    }
    .recordSaveBody {
        margin: 10px;
        display: flex;
        justify-content: space-between;
        .recordSaveText {
            width: 60%;
            /* background-color: yellowgreen; */
            display: flex;
            flex-direction: column;
            .recordText {
                display: flex;
                margin-bottom: 20px;
                h4 {
                    font-size: 24px;
                    color:  rgb(250, 117, 65, 0.85);
                    margin-right: 10px;
                }
                p {
                    font-size: 24px;
                    color:  rgb(250, 117, 65, 0.85);
                }
            }
            .recordSaveContainer {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                position: relative;
                .recordInput {
                    display: flex;
                    width: 100%;
                    height: 200px;
                    max-height: 200px;
                    min-height: 200px;
                    border-radius: 10px;
                    border: none;
                    background-color:  rgb(250, 117, 65, 0.3);
                    /* background-color: rgba(255, 255, 255); */
                    color:  rgb(250, 117, 65, 0.85);
                    outline: none;
                    margin-top: 5px;
                    padding: 15px;
                    /* 그림자 효과 추가 */
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);

                    /* 입체적인 효과 추가 */
                    transform: translateZ(5px);
                    transition: transform 0.2s ease;
                    &::placeholder {
                        color:  rgb(250, 117, 65, 0.85);
                    }
                    &:focus {
                        background-color:  rgb(250, 117, 65, 0.3);
                    }
                }
                button {
                    position: absolute;
                    top: 240px;
                    /* right: -200px; */
                    margin-top: 10px;
                    width: 60px;
                    height: 35px;
                    border-radius: 50px;
                    border: none;
                    color: white;
                    font-size: 15px;
                    font-weight: bold;
                    cursor: pointer;
                    background-color: rgba(250, 117, 65, 0.8);
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease; /* 변환 효과 추가 */

                    &:hover {
                        /* 호버 시 약간의 변환 효과 추가 */
                        transform: translateZ(5px);
                        background-color: rgb(250, 117, 65);
                    }
                }
            }
        }
        .checkBox {
            width: 30%;
            display: flex;
            flex-direction: column;
            h4 {
                font-size: 20px;
                color: rgb(250, 117, 65, 0.85);
                text-align: end;
                margin-right: 5px;
                margin-top: 5px;
                margin-bottom: 20px;
            }
            .friendCheck {
                display: flex;
                justify-content: start;
                align-items: center;
                background-color: rgb(250, 117, 65, 0.3);
                border-radius: 10px;
                list-style: none;
                position: relative;
                margin-top: 5px;
                margin-bottom: 5px;
                padding: 13px;
                /* 그림자 효과 추가 */
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);

                /* 입체적인 효과 추가 */
                transform: translateZ(5px);
                transition: transform 0.2s ease;
                input {
                    width: 18px;
                    height: 18px;
                    margin-right: 7px;
                }
                label {
                    word-break: break-all;
                    color: rgb(250, 117, 65, 0.85);
                }
            }
        }
        @media screen and (max-width: 500px) {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .recordSaveText {
                display: flex;
                width: 100%;
                padding: 30px;
                .recordSaveContainer {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                    position: relative;
                    .recordInput {
                        width: 90%;
                    }
                    button {
                        /* position: absolute; */
                        /* top: -55px; */
                        left: 0px;
                        width: 50px;
                        height: 35px;
                    }
                }
            }
            .checkBox {
                display: flex;
                border-top: solid 0.01rem white;
                padding-top: 15px;
                width: 100%;
            }
        }
    }
    overflow-y: scroll;
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
    &::-webkit-scrollbar {
        display: none;
    }
`;

export default PlanSave;