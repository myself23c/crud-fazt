// queueMiddleware.js
const createQueueMiddleware = () => {
    let isProcessing = false;
    let pendingRequests = [];

    const processNext = async () => {
        if (isProcessing || pendingRequests.length === 0) {
            return;
        }

        isProcessing = true;
        const nextRequest = pendingRequests.shift();
        
        try {
            await nextRequest();
        } finally {
            isProcessing = false;
            processNext(); // Procesa la siguiente solicitud después de completar la actual
        }
    };

    const queueMiddleware = (req, res, next) => {
        pendingRequests.push(() => new Promise(resolve => {
            next();
            resolve();
        }));

        console.log(`Nueva solicitud agregada. Solicitudes en cola: ${pendingRequests.length}`);
        processNext();
    };

    return { queueMiddleware };
};

export default createQueueMiddleware;
