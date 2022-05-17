//tile
import styled from 'styled-components';
const SudokuTile = styled.input`
    transition:.3s all;
    width: 40px;
    height: 40px;
    border: 1px solid rgb(66, 37, 133);
    color:#fff;
    text-shadow:0 0 5px rgb(111 82 177);
    border-radius: 5px;
    background-color: rgb(185, 211, 233);
    text-align:center;
    font-weight:bold;
    font-size:1.5rem;
    outline: none;
    &::-webkit-inner-spin-button,&::-webkit-outer-spin-button{
        appearance:none;
    }
    &:hover{
        background-color:rgb(111 82 177);
    }
    &:focus{
        background-color:#fff;
        color:rgb(111 82 177);
        font-size:1.6rem;
        box-shadow:0 0 10px rgb(111 82 177) inset;
    }
`;
export default SudokuTile;
