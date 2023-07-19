import React from "react";
import { useLocation } from "react-router-dom";
import PlanSearch from "./PlanSearch";
import styled from "styled-components";

const AddPlan = () => {
    const location = useLocation() ;
    const pathname = location.pathname ; 
    const pathUID = (pathname.split('/')[2]);
    const pathDocID = (pathname.split('/')[3]);
    const state = (location.state);
    
    return(
        <Container>
            <PlanSearch pathUID={pathUID} pathDocID={pathDocID} state={state}/>
        </Container>
    )
};

const Container = styled.div``;

export default AddPlan;