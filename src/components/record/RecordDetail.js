import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import MapComponent from "../MapComponent";
import AddRecordDetail from "./AddRecordDetail";
import BackButton from "../modal/BackButton";
import styled from "styled-components";
import { HiOutlinePencilSquare } from "react-icons/hi2";

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

    const getLoginUserData = useCallback(async () => {
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
    }, [pathDocID, pathUID]);

    const getMainPing = useCallback(async () => {
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

    useEffect(() => {
        getLoginUserData();
        getMainPing();
    }, [getLoginUserData, getMainPing]);

    const onDelete = async() => {
        alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
        const ok = window.confirm("그럼에도 게시글을 삭제하시겠습니까?");
        if(ok) {
            await deleteDoc(doc(db, "UserInfo", `${pathUID}`, "record", `${pathDocID}`)); 
            navigate("/");
        }
    };

    return (
        <Container>
            <div className="placeHeaderContainer">
                <BackButton /> 
                <div className='placeHeader'>
                    <HiOutlinePencilSquare size="35px" className='searchIcon' />
                    <h4> RecordDetail </h4>
                </div>
            </div>

            <div className="recordMessageContainer">

                <MapComponent />

                <div className="recordMainBody">
                    <div className="recordMainContainer">
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

                        <p> 날짜 : {recordData.date} </p>
                        <p> 기록 : {recordData.record} </p>
                    </div>
                    
                    <div className="recordMainButton">
                        <button onClick={getMainPing}> 이 장소 보기 </button>
                        <button onClick={onDelete}> 삭제 </button>
                    </div>
                </div>

                <button className="addBtn"
                    onClick={() => {
                        navigate(`/addrecord/${pathUID}/${pathDocID}`, {
                            state: {
                                share,
                                placeY: recordData.placeY,
                                placeX: recordData.placeX,
                                placeID: recordData.placeID
                            }
                        });
                    }}> 기록 추가하기 </button>
            </div>

            <div className="addRecordContainer">

                {addRecordData && <>
                    {addRecordData.map((r, i) => (
                        <AddRecordDetail key={i} addRecordData={r} pathUID={pathUID} pathDocID={pathDocID}/>
                    ))}
                </>}
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: grey;
    width: 60vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    @media screen and (max-width: 700px) {
        width: 100vw;
    }
    .placeHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: black;
        }
        .placeHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
            }
            h4 {
                font-size: 17px;
            }
        }
    }
    .recordMessageContainer {
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-right: 20px;
        margin-left: 20px;
        margin-top: 3px;
        margin-bottom: 5px;
        padding: 13px;
        display: flex;
        .mapComponent {
            width: 100%;
            height: 25vh;
            max-height: 25vh;
            min-height: 25vh;
        }
        .recordMainBody {
            display: flex;
            flex-direction: row;
            flex: 1;
            .recordMainContainer {
                display: flex;
                flex-direction: column;
                margin-top: 10px;
                flex: 0.75;
                h3 {
                    margin-top: 8px;
                    font-size: 18px;
                    color: white;
                    margin-bottom: 3px;
                }
                p {
                    font-size: 14px;
                    color: white;
                    margin-top: 3px;
                }
            }
            .recordMainButton {
                display: flex;
                flex: 0.25;
                flex-direction: column;
                margin-top: 10px;
                button {
                    margin-top: 8px;
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
        }
        .addBtn {
            position: absolute;
            width: 50px;
            height: 50px;
            right: 0px;
            bottom: -60px;
            z-index: 10;
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
    .addRecordContainer {
        display: flex;
        flex-direction: column;
        margin: 0px 20px 20px 20px;
        position: relative;
        overflow-y: scroll;
        -ms-overflow-style: none; /* 인터넷 익스플로러 */
        scrollbar-width: none; /* 파이어폭스 */
        &::-webkit-scrollbar {
            display: none;
        }
    }
`;


export default RecordDetail;