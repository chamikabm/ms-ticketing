export const stripe = {
    charges: {
        // Instead of a mock implementation as we did with nats-wrapper
        // here we are doing a different approach, that is we make it resolve
        // with an empty object.
        create: jest.fn().mockResolvedValue({}),
    }
}