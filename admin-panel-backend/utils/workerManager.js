const { Worker } = require('worker_threads');
const path = require('path');

class WorkerManager {
  constructor() {
    this.worker = null;
    this.isProcessing = false;
  }

  initialize() {
    if (!this.worker) {
      this.worker = new Worker(path.join(__dirname, '../workers/certificateGenerator.js'));
      
      this.worker.on('error', (error) => {
        console.error('Worker error:', error);
      });

      this.worker.on('exit', (code) => {
        if (code !== 0) {
          console.error(`Worker stopped with exit code ${code}`);
          this.worker = null;
        }
      });
    }
    return this.worker;
  }

  async generateCertificates(eventData, users) {
    if (this.isProcessing) {
      throw new Error('Certificate generation already in progress');
    }

    this.isProcessing = true;
    const worker = this.initialize();

    return new Promise((resolve, reject) => {
      const cleanup = () => {
        this.isProcessing = false;
      };

      worker.once('message', ({ type, data }) => {
        if (type === 'ready') {
          worker.postMessage({ 
            type: 'generate', 
            eventData, 
            users 
          });
        }
      });

      worker.on('message', ({ type, data }) => {
        if (type === 'completion') {
          cleanup();
          resolve(data);
        } else if (type === 'certificate-error') {
          console.error(`Error generating certificate for ${data.userEmail}:`, data.error);
        }
      });
    });
  }
}

module.exports = new WorkerManager();