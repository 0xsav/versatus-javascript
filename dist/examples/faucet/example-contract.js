import { FaucetProgram } from '../../lib/classes/programs/FaucetProgram.js.js.js';
const start = (input) => {
    const contract = new FaucetProgram();
    return contract.start(input);
};
export default start;
