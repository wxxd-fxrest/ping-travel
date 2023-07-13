import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import AddRecordDetail from "./AddRecordDetail";

const RecordDetail = () => {
    const { kakao } = window;
    const location = useLocation() ;
    const navigate = useNavigate();
    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    const [recordData, setRecordData] = useState([]);
    const [addRecordData, setAddRecordData] = useState([]);
    const [share, setShare] = useState([]);
    // let saveDate = recordData.recordDate.toDate();
    // let Year = saveDate.getFullYear();
    // let Month = saveDate.getMonth()+1;
    // let Date = saveDate.getDate();
    // let Hours = saveDate.getHours();
    // let Minutes = saveDate.getMinutes(); 

    useEffect(() => {
        const getLoginUserData = async () => {
            const docRef = doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setRecordData(docSnap.data());
                setShare(docSnap.data().selectFriend);
                setAddRecordData(docSnap.data().addRecord);
                console.log(docSnap.data())
            } else {
                console.log("No such document!");
            }
        };
        getLoginUserData();
    }, [pathDocID, pathUID]);

    useEffect(() => {
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(recordData.placeY, recordData.placeX),
            level: 6,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(recordData.placeY, recordData.placeX)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: recordData.placeName, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
    });

    return (
        <div>
            RecordDetail
            <MapComponent />
            <h3> 장소 : {recordData.placeName} </h3>
            {share ? <>
                <p> 함께 공유한 user </p>
                {share.map((r, i) => {
                    return (
                        <div key={i}>
                            <p> {r} </p>
                        </div>
                    )
                })}
            </> : <>
                <p> 공유해준 user : {recordData.ownerRecord} </p>
            </>}
            <p> 기록 : {recordData.record} </p>
            {addRecordData && <>
                {addRecordData.map((r, i) => (
                    <AddRecordDetail key={i} addRecordData={r}/>
                ))}
            </>}

            <button onClick={() => {
                navigate(`/addrecord/${pathUID}/${pathDocID}`, {
                    state: {
                        share,
                        placeY: recordData.placeY,
                        placeX: recordData.placeX,
                        placeID: recordData.placeID
                    }
                });
            }}> 기록 추가하기 </button>
            {/* <p> 시간 : {Year}-{Month}-{Date} / {Hours} : {Minutes} </p> */}
        </div>
    )
};

export default RecordDetail;