import React, { useCallback, useEffect } from "react";
import MapComponent from "../MapComponent";
import { Map } from "react-kakao-maps-sdk";

const AddRecordDetail = ({addRecordData}) => {
    const { kakao } = window;

    const getAddData = useCallback(() => {
        console.log(addRecordData)
        let container = document.getElementById("map");
        let options = {
            center: new kakao.maps.LatLng(addRecordData.placeY, addRecordData.placeX),
            level: 10,
        };
        //map
        const map = new kakao.maps.Map(container, options);

        // 마커를 생성합니다
        const marker = new kakao.maps.Marker({
            //마커가 표시 될 지도
            map: map,
            //마커가 표시 될 위치
            position:  new kakao.maps.LatLng(addRecordData.placeY, addRecordData.placeX)
        });
        marker.setMap(map);

        var infowindow = new kakao.maps.InfoWindow({
            content: addRecordData.placeName, // 인포윈도우에 표시할 내용
        });
        
        infowindow.open(map, marker);
    }, [addRecordData, kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker])

    useEffect(() => {
        getAddData()
        
    }, [getAddData]);

    return (
        <div>
            {/* <MapComponent /> */}
            <Map id='map' 
                center={{ lat: addRecordData.placeY, lng: addRecordData.placeX }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
            </Map>
            <p> {addRecordData.placeName} </p>
            <p> {addRecordData.record} </p>
        </div>
    )
};

export default AddRecordDetail;