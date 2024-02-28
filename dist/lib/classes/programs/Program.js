import { buildCreateInstruction, buildProgramUpdateField, buildTokenDistributionInstruction, buildTokenUpdateField, buildUpdateInstruction, } from '../../../lib/builders.js';
import { THIS } from '../../../lib/consts.js';
import { AddressOrNamespace, TokenOrProgramUpdate } from '../../../lib/classes/utils.js';
import { ProgramUpdate } from '../../../lib/classes/Program.js';
import { Outputs } from '../../../lib/classes/Outputs.js';
import { formatVerse } from '../../../lib/utils.js';
/**
 * Class representing a Program with methods to manage and execute program strategies.
 */
export class Program {
    /**
     * Constructs a new Program instance.
     */
    constructor() {
        this.methodStrategies = {
            create: this.create.bind(this),
            update: this.update.bind(this),
        };
    }
    create(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs, from } = transaction;
        const txInputs = JSON.parse(transactionInputs);
        const totalSupply = formatVerse(txInputs?.totalSupply);
        const initializedSupply = formatVerse(txInputs?.initializedSupply);
        const to = txInputs?.to ?? from;
        const symbol = txInputs?.symbol;
        const name = txInputs?.name;
        if (!totalSupply || !initializedSupply) {
            throw new Error('Invalid totalSupply or initializedSupply');
        }
        if (!symbol || !name) {
            throw new Error('Invalid symbol or name');
        }
        const tokenUpdateField = buildTokenUpdateField({
            field: 'metadata',
            value: JSON.stringify({ symbol, name, totalSupply }),
            action: 'extend',
        });
        if (tokenUpdateField instanceof Error) {
            throw tokenUpdateField;
        }
        const tokenUpdates = [tokenUpdateField];
        const programUpdateField = buildProgramUpdateField({
            field: 'metadata',
            value: JSON.stringify({ symbol, name, totalSupply }),
            action: 'extend',
        });
        if (programUpdateField instanceof Error) {
            throw programUpdateField;
        }
        const programUpdates = [programUpdateField];
        const programMetadataUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        const distributionInstruction = buildTokenDistributionInstruction({
            programId: THIS,
            initializedSupply,
            to,
            tokenUpdates,
        });
        const createAndDistributeInstruction = buildCreateInstruction({
            from,
            initializedSupply,
            totalSupply,
            programId: THIS,
            programOwner: from,
            programNamespace: THIS,
            distributionInstruction,
        });
        return new Outputs(computeInputs, [
            createAndDistributeInstruction,
            programMetadataUpdateInstruction,
        ]).toJson();
    }
    /**
     * Executes a program method strategy based on the given input.
     * @throws Will throw an error if the method name specified in `input` is not found in `methodStrategies`.
     * @returns The result of the strategy execution.
     * @param inputs
     */
    executeMethod(inputs) {
        const { op } = inputs;
        const strategy = this.methodStrategies[op];
        if (strategy) {
            return strategy(inputs);
        }
        throw new Error(`Unknown method: ${op}`);
    }
    /**
     * Initiates the execution of a program method based on the provided input.
     * @returns The result of executing the program method.
     * @param computeInputs
     */
    start(computeInputs) {
        return this.executeMethod(computeInputs);
    }
    /**
     * Updates the program with the provided inputs.
     * @returns The result of updating the program.
     * @param computeInputs
     */
    update(computeInputs) {
        const { transaction } = computeInputs;
        const { transactionInputs } = transaction;
        const parsedTransactionInputs = JSON.parse(transactionInputs);
        const data = parsedTransactionInputs?.data ?? undefined;
        const metadata = parsedTransactionInputs?.metadata ?? undefined;
        // const status = parsedTransactionInputs?.status ?? ''
        const programUpdates = [];
        if (metadata) {
            const fieldUpdate = buildProgramUpdateField({
                field: 'metadata',
                value: JSON.stringify(metadata),
                action: 'extend',
            });
            if (fieldUpdate instanceof Error) {
                throw fieldUpdate;
            }
            programUpdates.push(fieldUpdate);
        }
        if (data) {
            const fieldUpdate = buildProgramUpdateField({
                field: 'data',
                value: JSON.stringify(data),
                action: 'extend',
            });
            if (fieldUpdate instanceof Error) {
                throw fieldUpdate;
            }
            programUpdates.push(fieldUpdate);
        }
        const programMetadataUpdateInstruction = buildUpdateInstruction({
            update: new TokenOrProgramUpdate('programUpdate', new ProgramUpdate(new AddressOrNamespace(THIS), programUpdates)),
        });
        return new Outputs(computeInputs, [
            programMetadataUpdateInstruction,
        ]).toJson();
    }
}
