//archivo middleware // queueMiddleware.js
/*
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
*/
class RequestQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    async processQueue() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }

        console.log('Procesando la siguiente solicitud en la cola...');
        this.isProcessing = true;
        const { req, res, next } = this.queue.shift();

        next();

        res.on('finish', () => {
            console.log('Solicitud completada. Procesando la siguiente en la cola, si existe.');
            this.isProcessing = false;
            this.processQueue();
        });
    }

    enqueue(req, res, next) {
        this.queue.push({ req, res, next });
        console.log('Nueva solicitud agregada a la cola. Tamaño actual de la cola:', this.queue.length);

        if (!this.isProcessing) {
            this.processQueue();
        }
    }
}

const createQueueMiddleware = () => {
    const requestQueue = new RequestQueue();
    return {
        queueMiddleware: (req, res, next) => requestQueue.enqueue(req, res, next)
    };
};

export default createQueueMiddleware;