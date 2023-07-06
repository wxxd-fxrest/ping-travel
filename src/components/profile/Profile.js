/* eslint-disable no-redeclare */
/* eslint-disable no-unused-vars */
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import MARKER from '../../img/marker.png';
import questionMarker from '../../img/question_marker.png';

// MARKER <a href="https://www.flaticon.com/free-icons/marker" title="marker icons">Marker icons created by kmg design - Flaticon</a> 
// questionMarker <a href="https://www.flaticon.com/free-icons/maps-and-location" title="maps and location icons">Maps and location icons created by Iconic Panda - Flaticon</a> 

const Profile = ({mainPing}) => {
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
    // console.log(mainPing)
    
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
        getPlaceAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathUID]);

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


    const getPlaceAll = () => {
        setOpen(false);
        setOpen2(false);
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(37.45978574975834, 126.9511239870991),
            level: 10,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        let myPing = mainPing.filter((ping) => ping.Data.UID === currentUser.uid);
        myPing.forEach((ping) => {
            if(ping.Data.type === 'question') {
                var imageSrc = MARKER, // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            } else if(ping.Data.type === 'review') {
                var imageSrc = questionMarker, // 마커이미지의 주소입니다    
                    imageSize = new kakao.maps.Size(50, 50), // 마커이미지의 크기입니다
                    imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            }

            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
                markerPosition = new kakao.maps.LatLng(ping.Data.placeY, ping.Data.placeX); // 마커가 표시될 위치입니다

    
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: markerPosition,
                image: markerImage,
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
                    setData(ping.Data);
                    console.log(data)
                    setOpen2(true)
                };
            };
        });
        // console.log(place);
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
            {mainPing.map((m, i) => {
                return (
                <div key={i}>
                    {m.Data.UID === currentUser.uid && <>
                        <h3>{m.Data.placeName}</h3>
                        <p>{m.Data.type}</p>
                        <p onClick={onClick}> {m.Data.placeY}, {m.Data.placeX}, {m.Data.type}, {m.Data.placeName} </p>
                    </>}
                </div>); 
            })}
        </div>
    )
};

export default Profile; 