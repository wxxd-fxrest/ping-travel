import React, { useCallback, useEffect } from "react";
import MapComponent from "../MapComponent";
import { Map } from "react-kakao-maps-sdk";

const AddPlanDetail = ({addPlanData}) => {
    const { kakao } = window;
    console.log(addPlanData)
    const getAddData = useCallback(() => {
        console.log(addPlanData)
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(addPlanData.placeY, addPlanData.placeX),
            level: 10,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(addPlanData.placeY, addPlanData.placeX)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: addPlanData.placeName, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
    }, [addPlanData, kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker])

    useEffect(() => {
        getAddData();
    }, [getAddData]);

    return (
        <div>
            {/* <MapComponent /> */}
            <Map id='map' 
                center={{ lat: addPlanData.placeY, lng: addPlanData.placeX }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
            </Map>
            <p> {addPlanData.placeName} </p>
            <p> {addPlanData.plan} </p>
        </div>
    )
};

export default AddPlanDetail;