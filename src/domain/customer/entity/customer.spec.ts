import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit tests", () => {
    it("should throw an error when id is empty", () => {
        expect(() => {
            new Customer("", "John");
        }).toThrow("Id is required");
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            new Customer("1", "");
        }).toThrow("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("1", "John");
        customer.changeName("Jane");
        expect(customer.name).toBe("Jane");
    });

    it("should activate customer", () => {
        const customer = new Customer("1", "John");
        const address = new Address("Street", 123, "12345-678", "City");

        customer.changeAddress(address);
        customer.activate();
        expect(customer.isActive()).toBe(true);
    });

    it("should deactivate customer", () => {
        const customer = new Customer("1", "John");
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    });

    it("should throw an error when address is undefined when you activate a customer", () => {
        const customer = new Customer("1", "John");
        expect(() => {
            customer.activate();
        }).toThrow("Address is required to activate a customer");
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "John");
        expect(customer.rewardPoints).toBe(0);
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    });

    it("should change address", () => {
        const customer = new Customer("1", "John");
        const address = new Address("Street", 123, "12345-678", "City");
        customer.changeAddress(address);
        expect(customer.address).toBe(address);
        const newAddress = new Address("Street 2", 456, "98765-432", "City 2");
        customer.changeAddress(newAddress);
        expect(customer.address).toBe(newAddress);
    });
});