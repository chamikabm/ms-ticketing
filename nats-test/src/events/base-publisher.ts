import { Subjects } from './subjects';
import { Stan } from 'node-nats-streaming';

interface Event {
    subject: Subjects;
    data: any;
}

export abstract class Publisher<T extends Event> {
    abstract subject: T['subject'];

    private client: Stan;

    constructor(client: Stan) {
        this.client = client;
    }

    publish(data: T['data']) {
        // We only can strings or text data in NATS
        // Hence we need to transform above data into plain text string using JSON.stringify()
        const dataString = JSON.stringify(data);

        this.client.publish(this.subject, dataString,() => {
            console.log(`Event Published`);

        });
    }

}