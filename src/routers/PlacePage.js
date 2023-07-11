/* eslint-disable no-redeclare */
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Map } from "react-kakao-maps-sdk";
import { addDoc, collection, doc, getDocs, query, setDoc, Timestamp, where } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../AuthContext";
import MainPing from "../components/MainPing";

// import MARKER from '..//img/marker.png';
// import questionMarker from '..//img/question_marker.png';
// import nullMarker from '..//img/location-pin.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 
// nullMarker <a href="https://www.flaticon.com/free-icons/unavailable" title="unavailable icons">Unavailable icons created by exomoon design studio - Flaticon</a> 
            
const PlacePage = ({mainPing}) => {
    const navigate = useNavigate();
    const { kakao } = window;
    const location = useLocation();
    const state = location.state;
    const {currentUser} = useContext(AuthContext);
    const [profileData, setProfileData] = useState([]); 
    // const pathname = location.pathname; 
    // const pathUID = (pathname.split('/')[2]);
    // let placeData = mainPing.filter((ping) => ping.Data.placeID === pathUID);
    // console.log(placeData)
    // console.log("pathUID =>", pathUID);
    // console.log("state: ", state);
    // console.log(places);
    // console.log(mainPing)
    // placey: m.Data.placeY,
    // placex: m.Data.placeX,
    const [write, setWrite] = useState(false);
    const [type, setType] = useState(false);
    const [text, setText] = useState("");
  
    useEffect(() => {
        const ProfileUserInfo = async () => {
            const getUserData = query(
                collection(db, "UserInfo"), 
                where("uid", "==", `${currentUser.uid}`));
            const querySnapshot = await getDocs(getUserData);
              querySnapshot.forEach((doc) => {
                  setProfileData(doc.data());
                //   console.log("profileData: ", profileData)
              }); 
        }; 
        ProfileUserInfo();
    }, [currentUser.uid]);

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    const onSaveBtn = async() => {
        let DocName = state.id
        await setDoc(doc(db, "MainPing", DocName), {
            placeName: state.name, 
            placeY: state.placey,
            placeX: state.placex,
            placeID: state.id,
            placeNumber: state.phone,
            placeAddress: state.address,
            placeRoadAddress: state.roadAdrees
        });
        if(type === true) {
            await addDoc(collection(db, "MainPing", DocName, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'question', 
                placeID: state.id,
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
            });
            await addDoc(collection(db, "UserInfo", `${currentUser.uid}`, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'question', 
                placeID: state.id,
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
            });
        } else if(type === false) {
            await addDoc(collection(db, "MainPing", DocName, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'review',
                placeID: state.id,
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
            });
            await addDoc(collection(db, "UserInfo", `${currentUser.uid}`, "about"), {
                UID: currentUser.uid,
                userID: profileData.ID,
                date: Timestamp.now(),
                about: text, 
                type: 'review',
                placeID: state.id,
                placeName: state.name, 
                placeY: state.placey,
                placeX: state.placex,
            });
        }
    };

    useEffect(() => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(state.placey, state.placex),
            level: 6,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(state.placey, state.placex)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: state.name, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
        
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.MarkerImage, kakao.maps.Point, kakao.maps.Size, mainPing, state.name, state.placex, state.placey, state.type]);

    return(
        <div>
            <button onClick={() => navigate("/")}> back </button>
            <Map id='map' 
                center={{ lat: state.placey, lng: state.placex }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
            </Map>
            <h4> {state.name} </h4>
            <MainPing mainPing={mainPing} id={state.id}/>
            <div>
                {currentUser ? <>
                    <input type="checkbox" 
                        value={write} 
                        onChange={() => setWrite(!write)}/>
                    {write === true && <>
                        <input type="text" 
                            name="text"
                            placeholder="내용을 입력해주세요" 
                            value={text} 
                            onChange={onChange}/>
                        <input type="checkbox" 
                            value={type} 
                            onChange={() => setType(!type)}/>
                        {type === false ? <>
                            <h4> 리뷰 </h4>
                        </> : <>
                            <h4> 질문 </h4>
                        </>}
                        <button type="button" onClick={onSaveBtn}> ok </button>
                    </>}
                </> : <p>  로그인 후 남길 수 있습니다. </p> }
            </div>
        </div>
    )
};

export default PlacePage;