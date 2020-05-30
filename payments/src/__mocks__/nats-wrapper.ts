// Mocking the NATS client.
export const natsWrapper = {
    client: {
        // Instead of this publish method we need to have a testable method with jest.
        // Because using this method we are faking the implementation, instead of that
        // we need to mock the function, to do that we need to use the jest.fn() method.
        // This jest.fn() also a fake function, but this allows us to test around it. (i.e use expect)
        // publish: (subject: string, data: string, callback: () => void) => {
        //     callback();
        // }
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();
        })
    }
};