/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import MARKER from '../../img/marker.png';
import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = () => {
    const { kakao } = window;
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const location = useLocation() ;

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const [profileData, setProfileData] = useState([]); 
    const [open, setOpen] = useState(false);
    const [pingData, setPingData] = useState([]);
    const [open2, setOpen2] = useState(false);
    const [myPingID, setMyPingID] = useState([]);
    const [friendAlert, setFriendAlert] = useState(false);
    let friend = location.state.friend; 
    console.log(friend)
    const friendList = () => {
        let IDlist = [] ; 
        for(let i = 0; i < friend.length; i++) {
            IDlist.push(
                <div key={i}>
                {friendAlert === true &&
                    <li> 
                        {friend[i]}
                    </li>}
                </div>
            )
        }
        return IDlist; 
    } ; 

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


    useEffect(() => {
        const FeedCollection = query(
            collection(db, "UserInfo", `${currentUser.uid}`, "about"));
          onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setMyPingID(feedArray);
            // console.log(feedArray)
        });
    }, [currentUser.uid]);


    const getPlaceAll = useCallback(() => {
        setOpen(false);
        setOpen2(false);

        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 10,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // let myPing = mainPing.filter((ping) => ping.Data.UID === currentUser.uid);
        myPingID.forEach((ping) => {
            console.log(ping)
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(ping.Data.placeY, ping.Data.placeX)
            });

            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: ping.Data.placeName, // 인포윈도우에 표시할 내용
            });
            
            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow)
            );

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    infowindow.open(map, marker);
                    setPingData(ping.Data);
                    // console.log(pingData)
                    setOpen2(true)
                };
            };
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, myPingID])

    useEffect(() => {
        getPlaceAll();
    }, [getPlaceAll]);

    const onClick = useCallback(async(e) => {
        setOpen(false);
        setOpen2(false);
        let all = (e.target.innerHTML);
        let placey = all.split(',')[0];
        let placex = all.split(',')[1];
        let placetype = all.split(',')[2];
        let placename = all.split(',')[3];
        let placeClickID = all.split(',')[4];
        console.log(placeClickID)
        // console.log("placey => ", placey, "placex => ", placex, "placetype =>", placetype);

        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(placey, placex),
            level: 4,
        };

        const map = new kakao.maps.Map(container, options);
        
        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position: new kakao.maps.LatLng(placey, placex),
            // image: markerImage,
        });
        marker.setMap(map);
    
        var infowindow = new kakao.maps.InfoWindow({
            content: placename, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);

        kakao.maps.event.addListener(
            marker,
            "click",
            makeOverListener(map, marker, infowindow),
        );
        function makeOverListener(map, marker, infowindow) {
            return async function () {
                setOpen(true);
            };
        };

        let geocoder = new kakao.maps.services.Geocoder();
    
        let coord = new kakao.maps.LatLng(placey, placex);
        let callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setPingData(result);
                // console.log(pingData[0].road_address.building_name);
                console.log(result)
            }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, kakao.maps.services.Geocoder, kakao.maps.services.Status.OK])

    return (
        <div>
            <h3><img src={profileData.attachmentUrl} alt="#" width="100px" height="100px" style={{borderRadius:"100px"}}/>{profileData.ID}</h3>
            <h5 onClick={() => setFriendAlert(!friendAlert)}> 💡 </h5> 
            {friendList()}
            <button onClick={(e) => {
                    e.preventDefault();
                    navigate('/')}}> 
                Home
            </button>
            <MapComponent />
            {open === true && <>
                {pingData[0].road_address.building_name && <>
                <h4> {pingData[0].road_address.building_name} </h4>
                <p onClick={() => setOpen(false)}>x</p> </>}
            </>}
            {open2 === true && <>
                {pingData && <> <h4> {pingData.placeName} </h4>
                <p onClick={() => setOpen2(false)}>x</p> 
                <button onClick={(e) => {
                    e.preventDefault();
                    navigate(`/place/${pingData.placeID}`, {
                        state: {
                            name: pingData.placeName,
                            phone: pingData.placeNumber,
                            id: pingData.placeID,
                            placey: pingData.placeY,
                            placex: pingData.placeX,
                            address: pingData.placeAddress,
                            roadAdrees: pingData.placeRoadAddress,
                        }
                    });
                }}> 상세보기 </button></>}
            </>}
            <button onClick={getPlaceAll}> 전체보기 </button>
            {myPingID.map((m, i) => {
                // console.log(m)
                return (
                <div key={i}>
                    {m.Data.UID === currentUser.uid && <>
                        <h3>{m.Data.placeName}</h3>
                        <p>{m.Data.type}</p>
                        <h5>{m.Data.about}</h5>
                        <p onClick={onClick}> {m.Data.placeY}, {m.Data.placeX}, {m.Data.type}, {m.Data.placeName}, {m.Data.placeID}</p>
                        <button onClick={(e) => {
                            e.preventDefault();
                            navigate(`/place/${m.Data.placeID}`, {
                                state: {
                                    name: m.Data.placeName,
                                    phone: m.Data.placeNumber,
                                    id: m.Data.placeID,
                                    placey: m.Data.placeY,
                                    placex: m.Data.placeX,
                                    address: m.Data.placeAddress,
                                    roadAdrees: m.Data.placeRoadAddress,
                                }
                            });
                        }}> 상세보기 </button>
                    </>}
                </div>); 
            })}
        </div>
    )
};

export default Profile; 