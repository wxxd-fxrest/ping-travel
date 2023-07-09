/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import MARKER from '../../img/marker.png';
import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = ({mainPing, myPingID}) => {
    const { kakao } = window;
    const navigate = useNavigate();
    const {currentUser} = useContext(AuthContext);
    const location = useLocation() ;

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const [profileData, setProfileData] = useState([]); 
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [open2, setOpen2] = useState(false);
    // const [markerData, setMarkerData] = useState([]);
    // console.log(pathUID)
    // console.log(myPing)
    // console.log(myPingID)
    // const [myPlace, setMyPlace] = useState([]);

    // for(let i = 0; i < myPingID.length; i++) {
    //     console.log(myPingID[i]);
    // }
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
  
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(ping.placeY, ping.placeX)
            });

            marker.setMap(map);

            var infowindow = new kakao.maps.InfoWindow({
                content: ping.placeName, // 인포윈도우에 표시할 내용
            });
            
            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow)
            );

            function makeOverListener(map, marker, infowindow) {
                return function () {
                    infowindow.open(map, marker);
                    setData(ping.Data);
                    // console.log(data)
                    setOpen2(true)
                };
            };
        });
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event, myPingID])

    useEffect(() => {
        getPlaceAll();
    }, [getPlaceAll]);

    const onClick = (e) => {
        setOpen(false);
        setOpen2(false);
        let all = (e.target.innerHTML);
        let placey = all.split(',')[0];
        let placex = all.split(',')[1];
        let placetype = all.split(',')[2];
        let placename = all.split(',')[3];
        console.log("placey => ", placey, "placex => ", placex, "placetype =>", placetype);

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
            return function () {
                setOpen(true);
            };
        };

        let geocoder = new kakao.maps.services.Geocoder();
    
        let coord = new kakao.maps.LatLng(placey, placex);
        let callback = function(result, status) {
            if (status === kakao.maps.services.Status.OK) {
                setData(result);
                console.log(data);
            }
        }
        geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
    };

    return (
        <div>
            <h3><img src={profileData.attachmentUrl} alt="#" width="100px" height="100px" style={{borderRadius:"100px"}}/>{profileData.ID}</h3>
            <button onClick={(e) => {
                    e.preventDefault();
                    navigate('/')}}> 
                Home
            </button>
            <MapComponent />
            {open === true && <>
                {data[0].address.address_name && <>
                <h4> {data[0].address.address_name} </h4>
                <p onClick={() => setOpen(false)}>x</p> </>}
            </>}
            {open2 === true && <>
                {data && <> <h4> {data.placeName} </h4>
                <p onClick={() => setOpen2(false)}>x</p> </>}
            </>}
            <button onClick={getPlaceAll}> 전체보기 </button>
            {/* {mainPing.map((m, i) => {
                return (
                <div key={i}>
                    {m.Data.UID === currentUser.uid && <>
                        <h3>{m.Data.placeName}</h3>
                        <p>{m.Data.type}</p>
                        <p onClick={onClick}> {m.Data.placeY}, {m.Data.placeX}, {m.Data.type}, {m.Data.placeName} </p>
                    </>}
                </div>); 
            })} */}
        </div>
    )
};

export default Profile; 