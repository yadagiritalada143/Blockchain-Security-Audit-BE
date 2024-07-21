import { ScanResultDetails } from '../intefaces/saveScanResultsInterface';
import scanResultsModel from '../model/scanResultsModel';

const saveScanResults = (scanResultsToSave: ScanResultDetails): Promise<any> => {
    const scanResultToSave = {
        userId: scanResultsToSave.userId,
        fileName: scanResultsToSave.filename,
        scanResult: scanResultsToSave.errors
    }

    return scanResultsModel.create(scanResultToSave);
}

const getAllScanResults = async () => {
    const records = await scanResultsModel.findAll();
    return records;
}

const getScanResultsByUserId = async (userId: number) => {
    const records = await scanResultsModel.findAll({ where: { userId } });
    return records;
}

export default { saveScanResults, getAllScanResults, getScanResultsByUserId }