import React, { useCallback, useContext } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";

const AddRecordDetail = ({addRecordData, pathUID, pathDocID}) => {
    const { kakao } = window;
    const {currentUser} = useContext(AuthContext);

    const onClick = useCallback(async(e) => {
        if(addRecordData) {
            let container = document.getElementById("map");
            let options = {
                center: new kakao.maps.LatLng(addRecordData.addPlaceY, addRecordData.addPlaceX),
                level: 4,
            };

            const map = new kakao.maps.Map(container, options);
            
            // 마커를 생성합니다
            const marker = new kakao.maps.Marker({
                //마커가 표시 될 지도
                map: map,
                //마커가 표시 될 위치
                position: new kakao.maps.LatLng(addRecordData.addPlaceY, addRecordData.addPlaceX),
                // image: markerImage,
            });
            marker.setMap(map);
        
            var infowindow = new kakao.maps.InfoWindow({
                content: addRecordData.addPlaceName, // 인포윈도우에 표시할 내용
            });
            
            infowindow.open(map, marker);

            kakao.maps.event.addListener(
                marker,
                "click",
                makeOverListener(map, marker, infowindow),
            );
            function makeOverListener(map, marker, infowindow) {
                return async function () {
                    // setOpen(true);
                };
            };
        }
        
    }, [addRecordData, kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, kakao.maps.event]);

    return (
        <div> 
            {currentUser.uid === addRecordData.writeUID ? 
            <Box>
                <div className="addContainer">
                    <div className="recordMainContainer">
                        <h3> {addRecordData.addPlaceName} </h3>
                        <p> {addRecordData.addDate} </p>
                        <p> {addRecordData.addRecord} </p>
                    </div>

                    <button onClick={onClick}> 해당 장소 지도로 보기 </button>

                    {currentUser.uid === addRecordData.writeUID &&
                        <button onClick={async () => {
                            alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
                            const ok = window.confirm("게시글을 삭제하시겠습니까?");
                            if(ok) {
                                await updateDoc(doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`), {
                                    addRecord: arrayRemove(addRecordData),
                                }); // 수락 시 요청 데이터 삭제 
                                window.location.reload();
                            }
                        }}> 삭제 </button>}
                </div>
            </Box> : <Box2>
                <div className="unAddContainer">
                    <div className="recordMainContainer">
                        <h3> {addRecordData.addPlaceName} </h3>
                        <p> {addRecordData.addDate} </p>
                        <p> {addRecordData.addRecord} </p>
                    </div>

                    <button onClick={onClick}> 해당 장소 지도로 보기 </button>

                    {currentUser.uid === addRecordData.writeUID &&
                        <button onClick={async () => {
                            alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
                            const ok = window.confirm("게시글을 삭제하시겠습니까?");
                            if(ok) {
                                await updateDoc(doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`), {
                                    addRecord: arrayRemove(addRecordData),
                                }); // 수락 시 요청 데이터 삭제 
                                window.location.reload() 
                            }
                        }}> 삭제 </button>}
                </div>
            </Box2>}
        </div>
    )
};

const Box = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-end;  
    .addContainer {
        width: 80%;
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px 10px 2px 10px;
        list-style: none;
        text-align: start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        display: flex;
        .mapComponent {
            width: 100%;
            height: 30vh;
            max-height: 30vh;
            min-height: 30vh;
            border-radius: 5px;
            overflow: hidden;
        }
        .recordMainContainer {
            display: flex;
            flex-direction: column;
            margin-top: 3px;
            /* margin-bottom: 10px; */
            h3 {
                font-size: 18px;
                color: white;
                margin-bottom: 5px;
            }
            p {
                font-size: 14px;
                color: white;
                margin-top: 5px;
            }
        }
        button {
            margin-top: 10px;
            width: 100%;
            height: 28px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;

const Box2 = styled.div`
    display: flex;
    width: 100%;
    justify-content: flex-start;  
    .unAddContainer {
        width: 80%;
        display: flex;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 10px 10px 10px 2px;
        list-style: none;
        text-align: start;
        /* align-items: flex-start; */
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        display: flex;
        .mapComponent {
            width: 100%;
            height: 30vh;
            max-height: 30vh;
            min-height: 30vh;
            border-radius: 5px;
            overflow: hidden;
        }
        .recordMainContainer {
            display: flex;
            flex-direction: column;
            margin-top: 3px;
            /* margin-bottom: 10px; */
            h3 {
                font-size: 18px;
                color: white;
                margin-bottom: 5px;
            }
            p {
                font-size: 14px;
                color: white;
                margin-top: 5px;
            }
        }
        button {
            width: 100%;
            height: 28px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;


export default AddRecordDetail;

