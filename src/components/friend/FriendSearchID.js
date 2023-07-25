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
        background-color: rgba(0, 150, 138, 0.85);
        padding-left: 15px;
        padding-right: 40px;
        color: rgba(255, 255, 255, 0.9);
        outline: none;
        /* border-bottom: solid 0.01rem rgba(0, 150, 138, 0.85); */
        &:hover {
            background-color: rgba(0, 150, 138, 0.85);
        }
        &::placeholder {
            color: rgba(255, 255, 255, 0.7);
            font-size: 12px;
        }
        &:focus {
            background-color: rgba(0, 150, 138, 0.85); 
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
        color: white;
        top: 7.5px;
        right: 10px;
        cursor: pointer;
        @media screen and (max-width: 750px) {
            right: 0px;
        }
    }
    .searchIDList {
        display: flex;
        background-color: rgba(0, 150, 138, 0.3);
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
            color: rgba(0, 150, 138, 0.9); 
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
            color: rgba(0, 150, 138, 0.9);
        }
        button {
            width: 100%;
            height: 25px;
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
        p {
            font-size: 10px;
        }
    }
`;

export default FriendSearchID;