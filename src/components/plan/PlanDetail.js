import React, { useEffect, useState } from "react";
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

    useEffect(() => {
        const getLoginUserData = async () => {
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
    }, [kakao.maps.InfoWindow, kakao.maps.LatLng, kakao.maps.Map, kakao.maps.Marker, planData.placeName, planData.placeX, planData.placeY]);

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

                <div className="recordMainContainer">
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
                        <p> 공유해준 user : {planData.ownerID} </p>
                    </>}

                    <p> 날짜 : {planData.date} </p>
                    <p> 계획 : {planData.plan} </p>
                </div>

                <button onClick={onDelete}> 삭제 </button>

            </div>

            <div className="addRecordContainer">
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
    background-color: grey;
    width: 80vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
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
        margin: 20px;
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px;
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
            height: 40vh;
            max-height: 40vh;
            min-height: 40vh;
        }
        .recordMainContainer {
            display: flex;
            flex-direction: column;
            margin-top: 10px;
            margin-bottom: 10px;
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
    .addRecordContainer {
        display: flex;
        flex-direction: column;
        margin: 0px 20px 20px 20px;
        .addBtn {
            width: 100%;
            height: 30px;
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
    overflow-y: scroll;
    -ms-overflow-style: none; /* 인터넷 익스플로러 */
    scrollbar-width: none; /* 파이어폭스 */
    &::-webkit-scrollbar {
        display: none;
    }
`;


export default PlanDetail;