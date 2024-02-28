import { Program } from '../../../lib/classes/programs/Program';
import { ComputeInputs } from '../../../lib/types';
/**
 * Class representing a fungible token program, extending the base `Program` class.
 * It encapsulates the core functionality and properties of the write
 * functionality of a fungible token.
 */
export declare class FungibleTokenProgram extends Program {
    /**
     * Constructs a new instance of the FungibleTokenProgram class.
     */
    constructor();
    approve(computeInputs: ComputeInputs): object;
    burn(computeInputs: ComputeInputs): object;
    mint(computeInputs: ComputeInputs): object;
}
