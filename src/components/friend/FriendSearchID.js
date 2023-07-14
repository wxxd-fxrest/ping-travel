import { useCallback, useState } from "react";
import { db } from "../../firebase";
import { arrayUnion, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

const FriendSearchID = ({loginUserData}) => {
    const [keyword, setKeyword] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [open, setOpen] = useState(false); 
    const [IDinclude, setIDinclude] = useState(false);
    const [requestInclude, setRequestInclude] = useState(false);

    // console.log(loginUserData)
    const handleSearch = useCallback(async (e) => {
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

    }, [keyword, loginUserData.ID, loginUserData.friendID, loginUserData.friendRequest, searchData.friendRequest]); 

    const clickPluse = async (e) => {
        e.preventDefault();
        await updateDoc(doc(db, "UserInfo", searchData.uid), {
            friendRequest: arrayUnion(loginUserData.ID)
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
                    {requestInclude === false ? <>
                        {IDinclude === false ? 
                            <button onClick={clickPluse}> 친구 추가 </button> : <p> 이미 추가된 친구입니다. </p>}
                    </> : <p> 이미 요청한 친구입니다. </p>}
                </li>   
            </>} 
        </div>
    )
};

export default FriendSearchID;