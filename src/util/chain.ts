import crypto from 'crypto-js';
import mongoose from 'mongoose';
const logger = require('elogger');

import models from '../model/bsaModel';

class Block {
    id: string;
    email: string;
    data: any;
    created_on: string;
    preceding_hash: string;
    hash: string;
    iterations: number;

    constructor(id: string, email: string, data: any, created_on: string, precedingHash: string = '--Gens--') {
        this.id = id;
        this.email = email;
        this.data = data;
        this.created_on = created_on;
        this.preceding_hash = precedingHash;
        this.hash = this.computeHash();
        this.iterations = 0;
    }

    computeHash() {
        return crypto.SHA512(
            this.id +
            this.preceding_hash +
            JSON.stringify(this.data) +
            this.iterations
        ).toString();
    }

    proofOfWork(difficulty: any) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.iterations++;
            this.hash = this.computeHash();
        }
    }
}

export class AuditLogBlockchain {
    difficulty: number;

    constructor() {
        this.difficulty = 3;
    }

    async initialize(email: string) {
        let genesisBlockInfo = await this.getGenesisBlock();
        if (!genesisBlockInfo) {
            logger.info('Initializing Genesis block . . .');
            let genesisBlockInfo = await this.createGenesisBlock(email);
            logger.info(`Genesis block: ${genesisBlockInfo.id}`);
        }
        else {
            logger.debug(`Existing Genesis block: ${genesisBlockInfo.id}`);
        }
    }

    async createGenesisBlock(email: string) {
        let id = new mongoose.Types.ObjectId().toHexString()
        let newblockInfo = new Block(id, email, null, '' + new Date().getTime());
        return await this.addNewBlock(newblockInfo);
    }

    async createTransaction(payload: any) {
        let precedingBlockInfo = await this.getPrecedingBlock();
        if (precedingBlockInfo) {
            let id = new mongoose.Types.ObjectId().toHexString();
            let currentBlockInfo = new Block(id, payload.email, payload, '' + new Date().getTime(), precedingBlockInfo.hash,);
            return await this.addNewBlock(currentBlockInfo);
        }
        return false;
    }

    async addNewBlock(blockObj: Block) {
        blockObj.proofOfWork(this.difficulty);
        return this.addBlockToChain(blockObj);
    }

    async addBlockToChain(blockInfo: { id: string; email: string, preceding_hash: string; data: string; hash: string; iterations: number; created_on: string; }) {
        console.log(blockInfo);
        let chainInfo = new models.BsaModel({ ...blockInfo });
        let chainEntry = await chainInfo.save();
        return chainEntry;
    }

    async getGenesisBlock() {
        let blockInfo = await models.BsaModel.find().sort({ $natural: 1 }).limit(1);
        return (blockInfo.length > 0) ? blockInfo[0] : null;
    }

    async getPrecedingBlock() {
        let blockInfo = await models.BsaModel.find().sort({ $natural: -1 }).limit(1);
        return (blockInfo.length > 0) ? blockInfo[0] : null;
    }

    async checkChainValidity() {
        console.log('Came to AuditLogBlockchain class for checking')
        let promise = new Promise((resolve) => {
            let previousBlock: Block | null = null;
            let currentBlock = null;
            let idx = 1;
            models.BsaModel.find({}).sort({ $natural: 1 }).cursor().on('data', entry => {
                logger.info(`Validating Block(${idx}): ${entry.id}`);
                if (previousBlock) {
                    // recreate the block with the info from database
                    currentBlock = new Block(entry.id, entry.email, entry.data, entry.created_on, entry.preceding_hash);
                    currentBlock.proofOfWork(this.difficulty);

                    // validate computed block hash with database hash entry
                    if (entry.hash !== currentBlock.hash) {
                        logger.error(`Stored hash(${entry.hash}) and computed hash(${currentBlock.hash}) doesn't match`);
                        // process.exit(0);
                    }
                    else {
                        logger.debug(`Block Computed Hash Validated: ${currentBlock.id} -> SUCCESS`);
                    }

                    // validate chain block with preceding hash
                    if (currentBlock.preceding_hash !== previousBlock.hash) {
                        logger.error(`Previous block hash(${previousBlock.hash}) and preceding block hash(${currentBlock.preceding_hash}) doesn't match`);
                        // process.exit(0);
                    }
                    else {
                        logger.debug(`Block Preceding Hash Chain Validated: ${currentBlock.id} -> SUCCESS`);
                    }

                    // assign current block as previous block for the next cycle
                    previousBlock = Object.assign({}, currentBlock);
                    idx++;
                }
                else {
                    logger.info(`Genesis Block(${idx}): ${entry.id}`);
                    previousBlock = new Block(entry.id, entry.email, entry.data, entry.created_on, entry.preceding_hash);
                    previousBlock.proofOfWork(this.difficulty);
                    idx++;
                }
            })
                .on('end', function () {
                    resolve(true);
                });
        });
        return promise;
    }
}
