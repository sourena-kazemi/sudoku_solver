//app
import styled from 'styled-components';
export const SolveButton = styled.button`
    transition:.3s all;
    border-radius:15px;
    padding:.5rem 1.3rem;
    box-shadow:0 0 15px 2px #fff;
    margin:1rem auto;
    color:rgb(111 82 177);
    font-size:2rem;
    font-weight:bold;
    border:none;
    &:hover{
        color:#fff;
        box-shadow:0 0 15px 2px rgb(111 82 177);
        background-color:rgb(111 82 177);
        transform:scale(1.1);
    }
`;
export const GenerateButton = styled(SolveButton)`
    box-shadow:0 0 15px 2px rgb(111 82 177);
    color:#fff;
    background-color:rgb(111 82 177);
    &:hover{
        color:rgb(111 82 177);
        box-shadow:0 0 15px 2px #fff;
        background-color:#fff;
    }
`;
export const PageOverLay = styled.div`
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    display:${props => props.visibility==="hidden" ? "none" : "block"}
`;
