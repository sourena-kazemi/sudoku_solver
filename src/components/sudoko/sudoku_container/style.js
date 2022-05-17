//container
import styled from 'styled-components';
const SudokuContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3,auto);
    grid-template-rows:repeat(3,auto);
    margin:2rem auto;
    background-color:rgb(66, 37, 133);
`;
export default SudokuContainer;