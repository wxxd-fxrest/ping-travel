import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";

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
        <Container>
            {type === true ? 
                <div>
                    {docData.Data.type === "review" && 
                    <div className="aboutBox">
                        <h4>{docData.Data.about}</h4> 
                    </div>} 
                </div> : 
                <div>
                    {docData.Data.type === "question" && 
                    <div className="aboutBox">
                        <h4>{docData.Data.about}</h4> 
                        <button onClick={() => setAnswer(!answer)}> 답변달기 </button> 
                    </div>}

                    {answer === true && <>
                        <input type="text" 
                            name="text"
                            placeholder="내용을 입력해주세요" 
                            value={text} 
                            onChange={onChange}/>

                        <button type="button" 
                            onClick={async () => {
                                let answerDocID = docData.DocID; 
                                // console.log(answerDocID);
                                // console.log(docData.placeID);

                                if(answerDocID) {
                                    await updateDoc(doc(db, "MainPing", `${docData.Data.placeID}`, "about", answerDocID), {
                                        answer: arrayUnion({
                                            text: text,
                                            UID: currentUser.uid,
                                        })
                                    });
                                } else {
                                    return ;
                                }
                            }}> ok 
                        </button>
                    </>} 

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
                </div>}
        </Container> 
    )
};

const Container = styled.div`
    /* background-color: aliceblue; */
    .aboutBox {
        display: flex;
        background-color: rgba(255, 255, 255, 0.27);
        border-radius: 10px;
        list-style: none;
        text-align: start;
        align-items: center;
        justify-content: space-between;
        position: relative;
        flex-direction: row;
        margin-top: 5px;
        margin-bottom: 10px;
        padding: 13px;
        h4 {
            
        }
        button {
            width: 60px;
            height: 30px;
            border-radius: 50px;
            border: none;
            background-color: rgba(0, 150, 138, 0.85);
            color: white;
            font-size: 12px;
            font-weight: bold;
            margin-right: 3px;
            cursor: pointer;
            &:hover {
                background-color: rgba(0, 150, 138);
            }
        }
    }
`;

export default MainPingMap;