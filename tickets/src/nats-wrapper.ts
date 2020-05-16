import nats, { Stan } from 'node-nats-streaming';

import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        // this._client.on('connect', () => {
        //     console.log('Connected to NATS!');
        // });
        // We promisify the above code just to use async await syntax on the caller end.

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('Connected to NATS!');
                resolve();
            });

            this._client!.on('error', (err) => {
                console.log('Connected to NATS!');
                reject(err);
            });
        });
    }
}

export const natsWrapper = new NatsWrapper();