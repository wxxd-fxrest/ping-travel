import { useCallback, useState } from "react";
import { db } from "../../firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import styled from "styled-components";
import { HiOutlineViewfinderCircle } from "react-icons/hi2";

const FriendSearchID = ({loginUserData, setRequestAlert, open, setOpen}) => {
    const [keyword, setKeyword] = useState("");
    const [searchData, setSearchData] = useState([]);
    // const [open, setOpen] = useState(false); 
    const [IDinclude, setIDinclude] = useState(false);
    const [requestInclude, setRequestInclude] = useState(false);

    // console.log(loginUserData)
    const handleSearch = useCallback(async (e) => {
        setRequestAlert(false);
        setOpen(false);
        e.preventDefault();
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요!');
            return;
        } else if(keyword === `${loginUserData.ID}`) {
            alert('본인 아이디는 검색할 수 없습니다.');
            setKeyword("");
            return;
        }
        setIDinclude(false);
        setKeyword(keyword);

        const q = query(
            collection(db, "UserInfo"), 
            where("ID", "==", `${keyword}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            setSearchData(doc.data());
            if(`${loginUserData.friendID}`.includes(keyword) === true) {
                setIDinclude(true); 
            } else if(`${loginUserData.friendRequest}`.includes(keyword) === true) {
                setRequestInclude(true);
            } else if(`${searchData.friendRequest}`.includes(loginUserData.ID) === true) {
                setRequestInclude(true);
            } 
            setOpen(true);
            setKeyword("");
        });

    }, [keyword, loginUserData.ID, loginUserData.friendID, loginUserData.friendRequest, searchData.friendRequest, setOpen, setRequestAlert]); 

    const clickPluse = async (e) => {
        e.preventDefault();
        await updateDoc(doc(db, "UserInfo", searchData.uid), {
            friendRequest: arrayUnion(loginUserData.ID)
        });
        alert("친구 추가 완료"); 
        setIDinclude(true); 
    };


    return (
        <Container>
            <input type="text" 
                placeholder='아이디를 입력하세요.' 
                value={keyword} 
                onChange={(e) => {
                    setKeyword(e.target.value);
                    setOpen(false);
                }}/>
            <HiOutlineViewfinderCircle size="21px" className="userSearchBtn" onClick={handleSearch} />

            {open === true && <>
                <li className="searchIDList">
                    <div className="searchIDcontainer">
                        <img src={searchData.attachmentUrl} alt="#" /> 
                        <h3> {searchData.ID} </h3>
                    </div>
                    {requestInclude === false ? <>
                        {IDinclude === false ? 
                            <button onClick={clickPluse}> 친구 추가 </button> : <p> 이미 추가된 친구입니다. </p>}
                    </> : <p> 이미 요청한 친구입니다. </p>}
                </li>   
            </>} 
        </Container>
    )
};

const Container = styled.div`
    display: block;
    position: relative;
    margin: 0px 10px 20px 10px;
    @media screen and (max-width: 600px) {
        display: none;
    }
    input {
        width: 65%;
        height: 34px;
        border-radius: 50px;
        border: none;
        background-color: white;
        padding-left: 15px;
        padding-right: 40px;
        color: rgba(250, 117, 65);
        outline: none;
        /* border-bottom: solid 0.01rem rgba(0, 150, 138, 0.85); */
        &:hover {
            background-color: white;
        }
        &::placeholder {
            color: rgba(250, 117, 65);
            font-size: 12px;
        }
        &:focus {
            background-color: rgba(255, 255, 255, 0.85); 
        }
        @media screen and (max-width: 500px) {
            width: 70%;
            padding-left: 10px;
            padding-right: 30px;
        }
    }
    .userSearchBtn {
        position: absolute;
        background-color: transparent;
        border: none;
        color: rgba(250, 117, 65);
        top: 7.5px;
        right: 10px;
        cursor: pointer;
        @media screen and (max-width: 750px) {
            right: 0px;
        }
    }
    .searchIDList {
        display: flex;
        background-color: white;
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: flex-start;
        justify-content: center;
        position: relative;
        flex-direction: column;
        margin-top: 10px;
        padding: 10px;
        .searchIDcontainer {
            display: flex;
            flex-direction: row;
            color: rgb(250, 117, 65, 0.9); 
            align-items: center;
            margin-bottom: 10px;
            img {
                border-radius: 100%;
                width: 40px;
                height: 40px;
            }
            h3 {
                font-size: 18px;
                margin-left: 10px;
                margin-top: 5px;
            }
        }
        p {
            margin-left: 10px;   
            font-size: 10px;
            color: rgb(250, 117, 65, 0.9);
        }
        button {
            width: 100%;
            height: 25px;
            border-radius: 50px;
            border: none;
            background-color: rgba(250, 117, 65, 0.8);
            color: white;
            font-size: 10px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1), 0px 1px 3px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease; /* 변환 효과 추가 */
            }

            button:hover {
                /* 호버 시 약간의 변환 효과 추가 */
                transform: translateZ(5px);
                background-color: rgb(250, 117, 65);
            }
        p {
            font-size: 10px;
        }
    }
`;

export default FriendSearchID;