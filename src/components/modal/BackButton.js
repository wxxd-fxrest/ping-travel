import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";

const BackButton = () => {
    const navigate = useNavigate();
    return (
        <Container>
            <HiOutlineArrowLeftCircle size="35px"
                className="haveBackBtn"
                onClick={(e) => {
                    e.preventDefault();
                    navigate(-1);
                }} />
        </Container>
    )
};

const Container = styled.div`
    .haveBackBtn {
        cursor: pointer;
    }
`;
export default BackButton;