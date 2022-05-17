//block
import styled from 'styled-components';
const SudokuBlock = styled.div`
    display: grid;
    grid-template-columns:repeat(3,auto);
    grid-template-rows:repeat(3,auto);
    margin:.2rem;
    border:1px solid rgb(66, 37, 133);
`;
export default SudokuBlock;