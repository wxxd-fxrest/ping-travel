import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import AddPlanDetail from "./AddPlanDetail";

const PlanDetail = () => {
    const { kakao } = window;
    const location = useLocation() ;
    const navigate = useNavigate();
    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    const [planData, setPlanData] = useState([]);
    const [addPlanData, setAddPlanData] = useState([]);
    const [share, setShare] = useState([]);
    // let saveDate = recordData.recordDate.toDate();
    // let Year = saveDate.getFullYear();
    // let Month = saveDate.getMonth()+1;
    // let Date = saveDate.getDate();
    // let Hours = saveDate.getHours();
    // let Minutes = saveDate.getMinutes(); 

    useEffect(() => {
        const getLoginUserData = async () => {
            const docRef = doc(db, "UserInfo", `${pathUID}`, "plan", `${pathDocID}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setPlanData(docSnap.data());
                setShare(docSnap.data().selectFriend);
                setAddPlanData(docSnap.data().addPlan);
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
            center: new kakao.maps.LatLng(planData.placeY, planData.placeX),
            level: 6,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(planData.placeY, planData.placeX)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: planData.placeName, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
    });

    return (
        <div>
            PlanDetail
            <MapComponent />
            <h3> 장소 : {planData.placeName} </h3>
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
                <p> 공유해준 user : {planData.ownerUID} </p>
            </>}
            <p> 계획 : {planData.plan} </p>
            {addPlanData && <>
                {addPlanData.map((r, i) => (
                    <AddPlanDetail key={i} addPlanData={r}/>
                ))}
            </>}

            <button onClick={() => {
                navigate(`/addplan/${pathUID}/${pathDocID}`, {
                    state: {
                        share,
                        placeY: planData.placeY,
                        placeX: planData.placeX,
                        placeID: planData.placeID
                    }
                });
            }}> 계획 추가하기 </button>
            {/* <p> 시간 : {Year}-{Month}-{Date} / {Hours} : {Minutes} </p> */}
        </div>
    )
};

export default PlanDetail;