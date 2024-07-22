import { Request, Response } from 'express';
import bsaService from '../services/bsa';


const generateBlocks = async (req: Request, res: Response) => {
    const { email, action_array } = req.body;
    await bsaService.generateBlocks(email, action_array)
        .then((responseAfterBlocksCreated) => {
            res.status(200).json({ success: true, data: responseAfterBlocksCreated });
        })
        .catch(error => {
            res.status(500).json({ success: false, message: 'Error in generating blocks !' });
        });
}

const getBlocksByUser = (req: Request, res: Response) => {
    const { email } = req.params;
    bsaService.getBlocksByUser(email)
        .then((responseAfterBlocksFetched) => {
            res.status(200).json({ success: true, data: responseAfterBlocksFetched });
        })
        .catch((error: any) => {
            res.status(500).json({ success: false, message: 'Error in fetching blocks !' })
        });
}

export default { generateBlocks, getBlocksByUser };