import { SnakeProgram } from '../../lib/classes/programs/SnakeProgram.js.js.js';
const start = (input) => {
    const contract = new SnakeProgram();
    return contract.start(input);
};
export default start;
