const { spawn } = require('child_process');
const path = require('path');

const CHECK_INTERVAL = 5000; // 5 seconds

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    const inputData = JSON.parse(event.body);

    return new Promise((resolve, reject) => {
        console.log("Spawning Python Process");
        const pythonProcess = spawn('python3.10', [path.join(__dirname, 'middleware.py'), '--cli'], {
            stdio: ['pipe', 'pipe', process.stderr]
        });
        console.log("Writing to Python");
        pythonProcess.stdin.write(JSON.stringify(inputData));

        console.log("Calling end...");
        pythonProcess.stdin.end();

        let result = '';

        console.log("Result: " + result);
        let checkCount = 0;

        const checkProcess = setInterval(() => {
            checkCount++;
            if (checkCount * CHECK_INTERVAL > 30000) { // 10 seconds limit
                clearInterval(checkProcess);
                pythonProcess.kill(); // Kill the process to prevent resource leak
                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        status: 'timeout',
                        message: 'Request timed out. Please try again.',
                        partialResult: result
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
            } else {
                // Check if the process has completed
                if (result) {
                    clearInterval(checkProcess);
                    resolve({
                        statusCode: 200,
                        body: result,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
            }
        }, CHECK_INTERVAL);

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stdout.on('end', () => {
            clearInterval(checkProcess);
            resolve({
                statusCode: 200,
                body: result,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        });

        pythonProcess.on('error', (error) => {
            console.error(`Error executing Python script: ${error.message}`);
            clearInterval(checkProcess);
            reject({
                statusCode: 500,
                body: 'Internal Server Error'
            });
        });
    });
};
