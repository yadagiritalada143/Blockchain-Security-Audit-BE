import ErrorData from '../types/scanResult';

interface ScanResult {
    errors: Array<ErrorData>;
}

interface ScanResultDetails {
    userId: number,
    filename: string;
    errors: Array<ErrorData>;
}

interface SaveScanResultsResponse {
    message: string;
}

export { ScanResult, ScanResultDetails, SaveScanResultsResponse }