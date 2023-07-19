import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import RecordSearch from "./RecordSearch";

const AddRecord = () => {
    const location = useLocation();
    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    const state = (location.state);

    return(
        <Container>
            <RecordSearch pathUID={pathUID} pathDocID={pathDocID} state={state}/>
        </Container>
    )
};

const Container = styled.div``;

export default AddRecord;