import { Request, Response } from 'express';
import bsaService from '../services/bsa';


const generateBlocks = async (req: Request, res: Response) => {
    const { email, action_array } = req.body;
    await bsaService.generateBlocks(email, action_array)
        .then((responseAfterBlocks) => {
            res.status(200).json(responseAfterBlocks);
        })
        .catch(error => {
            res.status(500).json({ message: 'Error in generating blocks !' })
        });
}

export default { generateBlocks };