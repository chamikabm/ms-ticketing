import { Ticket } from '../ticket';

describe('Ticket Model', () => {
    it('Should implements optimistic concurrency control.', async () => {
        // Create an instance of Ticket
        const ticket = Ticket.build({
            title: 'concert',
            price: 5,
            userId: '123',
        });

        // Save ticket to the database
        await ticket.save();

        // Fetch the ticket twice
        const firstInstance = await Ticket.findById(ticket.id);
        const secondInstance = await Ticket.findById(ticket.id);

        // Make two changes to tickets above fetched
        firstInstance!.set({ price: 10 });
        secondInstance!.set({ price: 15 });

        // Save the first fetched ticket
        await firstInstance!.save();

        // Save the second fetched ticket and expect an error
        await expect(secondInstance!.save()).rejects.toBeTruthy();
    });

    it('Should increments the version number on multiple saves.', async () => {
        // Create an instance of Ticket
        const ticket = Ticket.build({
            title: 'concert',
            price: 5,
            userId: '123',
        });

        // Save ticket to the database
        await ticket.save();
        expect(ticket.version).toEqual(0);

        // Save ticket again to the database
        await ticket.save();
        expect(ticket.version).toEqual(1);
    });
});