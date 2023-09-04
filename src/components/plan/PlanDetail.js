import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import MapComponent from "../MapComponent";
import AddPlanDetail from "./AddPlanDetail";
import BackButton from "../modal/BackButton";
import styled from "styled-components";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const PlanDetail = () => {
    const { kakao } = window;
    const location = useLocation();
    const navigate = useNavigate();

    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    // console.log(pathDocID)
    const [planData, setPlanData] = useState([]);
    const [addPlanData, setAddPlanData] = useState([]);
    const [share, setShare] = useState([]); 


    const getLoginUserData = useCallback(async () => {
        const docRef = doc(db, "UserInfo", `${pathUID}`, "plan", `${pathDocID}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setPlanData(docSnap.data());
            setShare(docSnap.data().selectFriend);
            setAddPlanData(docSnap.data().addPlan);
            // console.log(docSnap.data())
        } else {
            console.log("No such document!"); 
        }
    }, [pathDocID, pathUID]);

    const getMainPing = useCallback(async () => {
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
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, planData.placeName, planData.placeX, planData.placeY]);

    useEffect(() => {
        getLoginUserData();
        getMainPing();
    }, [getLoginUserData, getMainPing]);

    const onDelete = async() => {
        alert("해당 게시글은 내 프로필 내에서만 삭제되며 공유한 user나, 공유된 user에게서는 삭제되지 않습니다.");
        const ok = window.confirm("게시글을 삭제하시겠습니까?");
        if(ok) {
            await deleteDoc(doc(db, "UserInfo", `${pathUID}`, "plan", `${pathDocID}`)); 
            navigate("/");
        }
    };

    return (
        <Container>
            <div className="placeHeaderContainer">
                <BackButton /> 
                <div className='placeHeader'>
                    <HiOutlinePencilSquare size="35px" className='searchIcon' />
                    <h4> PlanDetail </h4>
                </div>
            </div>

            <div className="recordMessageContainer">

                <MapComponent />

                <div className="recordMainBody">
                    <div className="recordMainContainer">
                        <h3> 장소 : {planData.placeName} </h3>

                        {share ? <>
                            <div  className="ShareUserID"> <p>동행 할 ID:</p>
                            {share.map((r, i) => {
                                return (
                                    <div key={i}>
                                        <p  style={{fontSize: '17px', fontWeight: '600'}}> {r} </p>
                                    </div>
                                )
                            })} </div>
                        </> : <>
                            <div  className="ShareUserID"> 
                                <p>동행 할 ID:</p>
                                <p style={{fontSize: '17px', fontWeight: '600'}}> {planData.ownerID} </p>
                            </div>
                        </>}
                        <p> 날짜 : {planData.date} </p>
                        <p> 계획 : {planData.plan} </p>
                    </div>
                    
                    <div className="recordMainButton">
                        <button onClick={getMainPing}> 이 장소 보기 </button>
                        <button onClick={onDelete}> 삭제 </button>
                    </div>
                </div>

                <button className="addBtn"
                    onClick={() => {
                        navigate(`/addplan/${pathUID}/${pathDocID}`, {
                            state: {
                                share,
                                placeY: planData.placeY,
                                placeX: planData.placeX,
                                placeID: planData.placeID
                            }
                        });
                    }}> 계획 추가하기 </button>
            </div>

            <div className="addRecordContainer">

                {addPlanData && <>
                    {addPlanData.map((r, i) => (
                        <AddPlanDetail key={i} addPlanData={r} pathUID={pathUID} pathDocID={pathDocID}/>
                    ))}
                </>}
            </div>
        </Container>
    )
};

const Container = styled.div`
    background-color: white;
    width: 50vw;
    height: 98vh;
    display: flex;
    flex-direction: column;
    border: solid 0.01rem rgba(250, 117, 65, 0.85);
    border-radius: 10px;
    @media screen and (max-width: 800px) {
        width: 80vw;
    }
    .placeHeaderContainer {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .haveBackBtn {
            color: rgba(250, 117, 65, 0.85);
        }
        .placeHeader {
            display: flex;
            align-items: center;
            .searchIcon {
                margin-right: 5px;
                color: rgba(250, 117, 65, 0.85);
            }
            h4 {
                font-size: 17px;
                color: rgba(250, 117, 65, 0.85);
            }
        }
    }
    .recordMessageContainer {
        display: flex;
        background-color: rgba(250, 117, 65, 0.3);
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
                    color: rgba(250, 117, 65, 0.85);
                    margin-bottom: 3px;
                    font-weight: bold;
                }
                p {
                    font-size: 14px;
                    color: rgba(250, 117, 65, 0.85);
                    margin-top: 3px;
                    margin-bottom: 5px;
                }
                .ShareUserID {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
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
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    cursor: pointer;
                    background-color: rgba(250, 117, 65, 0.8);
                    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease; /* 변환 효과 추가 */

                    &:hover {
                        /* 호버 시 약간의 변환 효과 추가 */
                        transform: translateZ(5px);
                        background-color: rgb(250, 117, 65);
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
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            background-color: rgba(250, 117, 65, 0.8);
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease; /* 변환 효과 추가 */

            &:hover {
                /* 호버 시 약간의 변환 효과 추가 */
                transform: translateZ(5px);
                background-color: rgb(250, 117, 65);
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

export default PlanDetail;