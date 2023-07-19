import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { db } from "../firebase";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import styled from "styled-components";
import { HiMiniArrowSmallRight, HiOutlineXCircle } from "react-icons/hi2";

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

    console.log(docData)

    return(
        <Container>
            {type === true ? 
                <div className="answerContainer">
                    {docData.Data.type === "review" && 
                    <div className="aboutBox">
                        <h4>{docData.Data.about}</h4> 
                    </div>} 
                </div> : 
                <div className="answerContainer">
                    {docData.Data.type === "question" && 
                    <div className="aboutBox">
                        <h4>{docData.Data.about}</h4> 
                        <button onClick={() => setAnswer(!answer)}> 답변달기 </button> 
                    </div>}

                    <div className="answerInput">
                        {answer === true && <>
                            <textarea type="text" 
                                name="text"
                                placeholder="답변을 입력해주세요" 
                                value={text} 
                                className="textarea"
                                onChange={onChange}/>
                                <button type="button" 
                                    className="textareaDeleteBtn"
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
                                            setText("");
                                            setAnswer(false);
                                        } else {
                                            return ;
                                        }
                                    }}> ok 
                                </button>
                        </>} 
                    </div>

                    <div className="answerList">
                        {answerData !== undefined && <div>
                            {answerData.map((a, i) => {
                                let answerDocID = docData.DocID; 
                                console.log(answerData)
                                return(
                                    <div className="answerMessage">
                                        <HiMiniArrowSmallRight size="23px" className="answerIcon"/>
                                        <div className="answerBody">
                                            <p key={i}> {a.text} </p>
                                            {currentUser.uid === a.UID &&
                                                <HiOutlineXCircle size="23px" className="deleteBtn"
                                                    onClick={async () => {
                                                        const ok = window.confirm("답변을 삭제하시겠습니까?")
                                                        if(ok) {
                                                            await updateDoc(doc(db, "MainPing", `${docData.Data.placeID}`, "about", answerDocID), {
                                                                answer: arrayRemove(a),
                                                            }); // 수락 시 요청 데이터 삭제 
                                                        }
                                                }}/>}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>} 
                    </div>
                </div>}
        </Container> 
    )
};

const Container = styled.div`
    display: flex;
    .answerContainer {
        display: flex;
        flex-direction: column;
        width: 100%;
        background-color: rgba(255, 255, 255, 0.27);
        margin-bottom: 3px;
        border-radius: 10px;
        .aboutBox {
            display: flex;
            background-color: rgba(255, 255, 255, 0.27);
            border-radius: 10px;
            list-style: none;
            align-items: center;
            justify-content: space-between;
            position: relative;
            flex-direction: row;
            margin-top: 5px;
            margin-bottom: 10px;
            padding: 13px;
            margin: 5px;
            border-bottom: solid 1px black;
            border-right: solid 1px black;
            h4 {
                font-size: 16px;
                color: white;
            }
            button {
                width: 80px;
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
        .answerInput {
            display: flex;
            align-items: center;
            padding: 0px 10px 0px 10px;
            .textarea {
                width: 85%;
                height: 40px;
                max-height: 40px;
                min-height: 40px;
                border-radius: 10px;
                border: none;
                background-color: rgba(255, 255, 255, 0.27);
                /* background-color: rgba(255, 255, 255); */
                color: rgba(255, 255, 255, 0.9);
                outline: none;
                padding: 10px;
                margin-right: 5px;
                margin-top: 5px;
                &:hover {
                    background-color: rgba(255, 255, 255, 0.4);
                }
                &::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }
                &:focus {
                    background-color: rgba(255, 255, 255, 0.4);
                }
            }
            .textareaDeleteBtn {
                width: 50px;
                max-width: 50px;
                min-height: 45px;
                height: 50px;
                border-radius: 50px;
                border: none;
                background-color: rgba(0, 150, 138, 0.85);
                color: white;
                font-size: 15px;
                font-weight: bold;
                cursor: pointer;
                &:hover {
                    background-color: rgba(0, 150, 138);
                }
            }
        }
        .answerList {
            /* display: flex; */
            flex-direction: row;
            justify-content: flex-end;
            width: 100%;
            .answerMessage {
                /* justify-content: space-between; */
                display: flex;
                align-items: center;
                margin-left: 20px;
                margin-right: 10px;
                .answerIcon {
                    margin-right: 10px;
                    color: white;
                }
                .answerBody {
                    width: 100%;
                    display: flex;
                    background-color: rgba(0, 0, 0, 0.27);
                    border-radius: 10px;
                    list-style: none;
                    text-align: start;
                    justify-content: space-between;
                    position: relative;
                    flex-direction: row;
                    margin-top: 5px;
                    margin-bottom: 10px;
                    padding: 13px;
                    display: flex;
                    align-items: center;
                    p {
                        font-size: 16px;
                        color: white;
                    }
                    .deleteBtn {
                        margin-left: 20px;
                        color: white;
                    }
                }
            }
        }
    }
`;

export default MainPingMap;