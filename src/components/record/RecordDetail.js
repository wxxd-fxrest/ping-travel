import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import MapComponent from "../MapComponent";
import AddRecordDetail from "./AddRecordDetail";

const RecordDetail = () => {
    const { kakao } = window;
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    // console.log(pathDocID)

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
                // console.log(docSnap.data())
            } else {
                console.log("No such document!");
            }
        };
        getLoginUserData();
    }, [pathDocID, pathUID]);

    const onDelete = async() => {
        alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
        const ok = window.confirm("그럼에도 게시글을 삭제하시겠습니까?");
        if(ok) {
            await deleteDoc(doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`)); 
            navigate("/");
        }
    };

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
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, recordData.placeName, recordData.placeX, recordData.placeY]);

    return (
        <div>
            <button onClick={(e) => {
                e.preventDefault();
                navigate(-1);
            }}> 뒤로가기 </button>
            RecordDetail
            <button onClick={onDelete}> 삭제 </button>
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
                <p> 공유해준 user : {recordData.ownerID} </p>
            </>}
            <p> 기록 : {recordData.record} </p>
            {addRecordData && <>
                {addRecordData.map((r, i) => (
                    <AddRecordDetail key={i} addRecordData={r} pathUID={pathUID} pathDocID={pathDocID}/>
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