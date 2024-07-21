import { Request, Response } from 'express';
import scanResultsService from '../services/scanResults';
import { ScanResultDetails, SaveScanResultsResponse } from '../intefaces/saveScanResultsInterface';

const saveScanResults = (req: Request, res: Response) => {
    const scanResultsToSave: ScanResultDetails = req.body;
    scanResultsService
        .saveScanResults(scanResultsToSave)
        .then((responseFromSaveScanResults: SaveScanResultsResponse) => {
            if (responseFromSaveScanResults) {
                scanResultsService.getAllScanResults()
                    .then((allScanResults) => {
                        res.status(200).json({ message: 'Fetched Successfully !', results: allScanResults })
                    })
                    .catch((error) => {
                        res.status(500).json({ message: 'Error Occured while fetching Scan Results after saved !' });
                    })
            } else {
                res.status(500).json({ message: 'Error Occured during saving the Scan Results !' });
            }
        })
        .catch((error) => {
            console.error(`Error Occured during saving the Scan Results: ${error}`);
            res.status(500).json({ message: 'Error Occured during saving the Scan Results !' });
        });
}

const getAllScanResults = (req: Request, res: Response) => {
    scanResultsService.getAllScanResults()
        .then((allScanResults) => {
            res.status(200).json({ message: 'Fetched Successfully !', results: allScanResults })
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error Occured while fetching Scan Results after saved !' });
        })
}

const getScanResultsByUserId = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    scanResultsService.getScanResultsByUserId(userId)
        .then((allScanResultsByUserId) => {
            res.status(200).json({ message: 'Fetched Successfully !', results: allScanResultsByUserId })
        })
        .catch((error) => {
            res.status(500).json({ message: 'Error Occured while fetching Scan Results after saved !' });
        })
}

export default { saveScanResults, getAllScanResults, getScanResultsByUserId }