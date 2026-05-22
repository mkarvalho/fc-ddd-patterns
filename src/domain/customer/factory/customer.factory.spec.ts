import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe('Customer factory unit tests', () => {
    it('should create a customer', () => {
        const customer = CustomerFactory.create("John Doe");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John Doe");
        expect(customer.address).toBeUndefined();
    });

    it('should create a customer with address', () => {

        const address = new Address("Main Street", 123, "12345", "City");
        const customer = CustomerFactory.createWithAddress("John Doe", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John Doe");
        expect(customer.address).toBeDefined();
        expect(customer.address).toBe(address);
    });
});