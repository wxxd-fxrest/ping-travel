import { arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "../../AuthContext";
import { db } from "../../firebase";

const FriendSearchID = ({loginUserData}) => {
    const {currentUser} = useContext(AuthContext); 

    const [keyword, setKeyword] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [open, setOpen] = useState(false); 
    const [IDinclude, setIDinclude] = useState(false);

    // console.log(loginUserData.friendID)
    const handleSearch = useCallback(async (e) => {
        e.preventDefault();
        if (!keyword.trim()) {
            alert('키워드를 입력해주세요!');
            return;
        }
        setIDinclude(false);
        setKeyword(keyword);

        const q = query(
            collection(db, "UserInfo"), 
            where("ID", "==", `${keyword}`));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
            setSearchData(doc.data());
            if(`${loginUserData.friendID}`.includes(keyword) === true) {
                setIDinclude(true); 
            }
            setOpen(true);
            setKeyword("");
        });

    }, [keyword, loginUserData]); 

    const clickPluse = async (e) => {
        e.preventDefault();
        await updateDoc(doc(db, "UserInfo", currentUser.uid), {
            friendRequest: arrayUnion(searchData.ID)
        });
        alert("친구 추가 완료"); 
        setIDinclude(true); 
    };


    return (
        <div>
            <div>
                <input type="text" 
                    placeholder='아이디를 입력하세요.' 
                    value={keyword} 
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setOpen(false);
                    }}/>
                <button onClick={handleSearch}> 검색 </button>
            </div>
            {open === true && <>
                <li>
                    <img src={searchData.attachmentUrl} alt="#" width="30px" height="30px" style={{borderRadius:"100px"}}/> 
                    {searchData.ID} 
                    {IDinclude === false ? 
                        <button onClick={clickPluse}> 친구 추가 </button> : <p> 이미 추가된 친구입니다. </p>}
                </li>   
            </>} 
        </div>
    )
};

export default FriendSearchID;