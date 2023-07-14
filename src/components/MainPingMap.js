import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const MainPingMap = ({docData, type}) => {
    const {currentUser} = useContext(AuthContext);
    const [answer, setAnswer] = useState(false);
    const [text, setText] = useState("");

    let answerData = docData.Data.answer;

    const onChange = (event) => {
        const {target : {name, value}} = event ; 
        if(name === "text") {
            setText(value) ; 
        } 
    };

    // console.log(docData)

    return(
        <div>
            {type === true ? <>
                {docData.Data.type === "review" && <>
                    <h4>{docData.Data.about}</h4> </>} 
                </> : <>
                {docData.Data.type === "question" && <>
                    <h4>{docData.Data.about}</h4> 
                    {answerData !== undefined && <>
                        {answerData.map((a, i) => {
                            let answerDocID = docData.DocID; 
                            return(
                                <>
                                    <p key={i}> {a.text} 
                                        <button onClick={async () => {
                                            const ok = window.confirm("답변을 삭제하시겠습니까?")
                                            if(ok) {
                                                await updateDoc(doc(db, "MainPing", `${docData.Data.placeID}`, "about", answerDocID), {
                                                    answer: arrayRemove(a),
                                                }); // 수락 시 요청 데이터 삭제 
                                            }
                                        }}> 답변 삭제 </button>
                                    </p>
                                </>
                            )
                        })}
                    </>} 
                    <button onClick={() => setAnswer(!answer)}> 답변달기 </button> 
                        {answer === true && <>
                            <input type="text" 
                                name="text"
                                placeholder="내용을 입력해주세요" 
                                value={text} 
                                onChange={onChange}/>
                            <button type="button" 
                                onClick={async () => {
                                    let answerDocID = docData.DocID; 
                                    console.log(answerDocID)
                                    console.log(docData.placeID)
                                    if(answerDocID) {
                                        await updateDoc(doc(db, "MainPing", `${docData.Data.placeID}`, "about", answerDocID), {
                                            answer: arrayUnion({
                                                text: text,
                                                UID: currentUser.uid,
                                            })
                                        })
                                    } else {
                                        return ;
                                    }
                                }}> ok 
                            </button>
                        </>} 
                    </>}
                </>}
        </div> 
    )
};

export default MainPingMap;