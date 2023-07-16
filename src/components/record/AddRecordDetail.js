import React, { useCallback, useEffect } from "react";
import { Map } from "react-kakao-maps-sdk";
import { db } from "../../firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";

const AddRecordDetail = ({addRecordData, pathUID, pathDocID}) => {
    const { kakao } = window;

    const getAddData = useCallback(() => {
        // console.log(addRecordData)
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
    }, [addRecordData, kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker]);

    useEffect(() => {
        getAddData();
    }, [getAddData]);

    return (
        <Container>
            <button onClick={async () => {
                alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
                const ok = window.confirm("게시글을 삭제하시겠습니까?");
                if(ok) {
                    await updateDoc(doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`), {
                        addRecord: arrayRemove(addRecordData),
                    }); // 수락 시 요청 데이터 삭제 
                    window.location.reload() 
                }
            }}> 삭제 </button>

            <Map id='map' 
                center={{ lat: addRecordData.placeY, lng: addRecordData.placeX }}
                level={3}
                style={{ width: '100%', height: '400px' }}>
            </Map>

            <p> {addRecordData.placeName} </p>
            <p> {addRecordData.date} </p>
            <p> {addRecordData.record} </p>
        </Container>
    )
};

const Container = styled.div``;

export default AddRecordDetail;