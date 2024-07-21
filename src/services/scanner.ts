import { exec } from 'child_process';

const runCommand = (cmd: string) => {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                resolve(new Error(`Command failed: ${cmd}\nError: ${error.message}\nStderr: ${stderr}\nStdout: ${stdout}`));
            } else {
                resolve(stdout);
            }
        });
    });
};

function extractErrorsFromResponse(eslintResult: any) {
    const errorPattern = /(\d+):(\d+)\s+error\s+(.+)\s/g;
    const errors = [];
    let match;

    while ((match = errorPattern.exec(eslintResult)) !== null) {
        const [, line, , description] = match;
        errors.push({
            "Error line": line,
            "Error Description": `${description}`
        });
    }
    return errors;
}

const checkVulnerabilities = async (filePath: string, actualFileName: string) => {
    try {
        // Check for the ESLint scanner //
        const eslintResult = await runCommand(`npx eslint ${filePath}`);
        const esLintErrorArray = extractErrorsFromResponse(eslintResult);

        // Check by using OPEN API -- Todo
        // openAPISolution.extractErrorsFromResponse(eslintResult);

        return {
            filename: actualFileName,
            errors: esLintErrorArray
        };
    } catch (error: any) {
        throw new Error(`Error in checking vulnerabilities: ${error.message}`);
    }
};

export default { checkVulnerabilities };