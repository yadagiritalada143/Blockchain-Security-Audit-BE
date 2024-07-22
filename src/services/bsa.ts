import { AuditLogBlockchain } from '../util/chain';
import models from '../model/bsaModel';
const logger = require('elogger');

const generateBlocks = async (email: string, action_array: string | any[]) => {
    let blockChain = new AuditLogBlockchain();
    await blockChain.initialize(email);

    for (let idx = 0; idx < action_array.length; idx++) {

        let payload = {
            email: email,
            user: email,
            ip: '127.0.0.1',
            user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97',
            action: action_array[idx],
            rtype: 'TEST',
            ref_id: 'TEST_00' + idx,
            created_on: new Date().getTime()
        };
        logger.info(`New Block Request: ${payload.ref_id}`);
        let entry = await blockChain.createTransaction(payload);
        logger.info(`New Transaction: ${entry.id}`);
    }

    // let status = await blockChain.checkChainValidity();
    // logger.info(`Chain Status: ${(status) ? 'SUCCESS' : 'FAILED'}`);
    // process.exit(0);

    return new Promise(async (resolve, reject) => {
        try {
            const blocksResponse = await models.BsaModel.find({ email: email });
            resolve(blocksResponse);
        } catch (error) {
            reject(error);
        }
    })
}


const getBlocksByUser = (email: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const blocksResponse = await models.BsaModel.find({ email: email });
            resolve(blocksResponse);
        } catch (error) {
            reject(error);
        }
    })
}

export default { generateBlocks, getBlocksByUser }