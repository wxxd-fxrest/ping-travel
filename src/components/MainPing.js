import React, { useCallback, useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import MainPingMap from "./MainPingMap";
import styled from "styled-components";

const MainPing = ({id}) => {
    const [docData, setDocData] = useState([]);
    const [type, setType] = useState(false); 

    const getAbout = useCallback(async () => {
        const FeedCollection = query(
            collection(db, "MainPing", `${id}`, "about"), 
            orderBy("date"));
        onSnapshot(FeedCollection, (querySnapshot) => {
            let feedArray = []
            querySnapshot.forEach((doc) => {
                feedArray.push({
                    DocID: doc.id, 
                    Data: doc.data(),
                })
            });
            setDocData(feedArray) ;
        });
    }, [id]);

    useEffect(() => {
        getAbout();
    }, [getAbout]);

    const [toggle, setToggle] = useState(false);

    const handleClickToggle = () => {
        setType(!type)
        setToggle((prev) => !prev);
    };
  
    const btnClassName = 
        ["toggle-btn", toggle ? "toggle-btn-on" : "toggle-btn-off",].join(" ");

    return (
        <Container>
            <div className="mainPingContainer">
                <h3>{type === true ? <p>리뷰 </p> : <p>질문 </p>} &nbsp; 목록 입니다. </h3>
                <label className="toggle-container" aria-label="Toggle">
                    <input
                        className="toggle-input"
                        type="checkbox"
                        checked={toggle}
                        value={type} 
                        onChange={() => setType(!type)}
                        onClick={handleClickToggle}
                        data-testid="toggle-input" />
                    <span className={btnClassName} />
                </label>
            </div>
            <div className="mainPingList">
                {docData.map((m, i) => (
                    <MainPingMap key={i} docData={m} type={type}/>
                ))}
            </div>
        </Container>
    )
}

const Container = styled.div`
    .mainPingContainer {
        /* background-color: #00968A; */
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        h3 {
            font-size: 16px;
            color: white;
            display: flex;
            flex-direction: row;
            p {
                font-size: 16px;
                color: white;
            }
        }
        .toggle-container {
            display: flex;
        }
        .toggle-btn {
            box-sizing: initial;
            display: inline-block;
            outline: 0;
            width: 2.5em;
            height: 1.3rem;
            position: relative;
            cursor: pointer;
            user-select: none;
            background: #fbfbfb;
            border-radius: 4em;
            padding: 4px;
            transition: all 0.4s ease;
            border: 1px solid #e8eae9;
        }
        .toggle-input:focus + .toggle-btn::after,
        .toggle-btn:active::after {
            box-sizing: initial;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08),
                inset 0px 0px 0px 3px #9c9c9c;
        }
        .toggle-btn::after {
            left: 0;
            position: relative;
            display: block;
            content: "";
            width: 50%;
            height: 100%;
            border-radius: 4em;
            background: #fbfbfb;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
                padding 0.3s ease, margin 0.3s ease;
            box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1), 0 4px 0 rgba(0, 0, 0, 0.08);
        }
        .toggle-btn.toggle-btn-on::after {
            left: 50%;
        }
        .toggle-btn.toggle-btn-on {
            background: #00968A;
        }
        .toggle-btn.toggle-btn-on:active {
            box-shadow: none;
        }
        .toggle-btn.toggle-btn-on:active::after {
            margin-left: -1.6em;
        }
        .toggle-btn:active::after {
            padding-right: 1.6em;
        }
        .toggle-btn[disabled] {
            opacity: 0.7;
            cursor: auto;
        }
        .toggle-input {
            border: 0;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
            white-space: nowrap;
        }
    }
`;

export default MainPing;