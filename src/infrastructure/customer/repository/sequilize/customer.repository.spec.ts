import { Sequelize } from "sequelize-typescript";
import CustomerModel from "./customer.model";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepository from "./customer.repository";

describe("Customer repository test", () => {
    let sequelize: Sequelize;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const adress = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(adress);
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: adress.street,
            number: adress.number,
            zipcode: adress.zip,
            city: adress.city,
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const adress = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(adress);
        await customerRepository.create(customer);

        customer.changeName("Customer 2");
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: "123" } });

        expect(customerModel.toJSON()).toStrictEqual({
            id: "123",
            name: customer.name,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
            street: adress.street,
            number: adress.number,
            zipcode: adress.zip,
            city: adress.city,
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const adress = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer.changeAddress(adress);
        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find("123");

        expect(foundCustomer).toStrictEqual(customer);
    });

    it("should throw an error when customer not found", async () => {
        const customerRepository = new CustomerRepository();
        await expect(customerRepository.find("123")).rejects.toThrow("Customer not found");
    });

    it("should find all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer1 = new Customer("123", "Customer 1");
        const adress1 = new Address("Street 1", 123, "13330-250", "São Paulo");
        customer1.changeAddress(adress1);
        customer1.addRewardPoints(10);
        await customerRepository.create(customer1);

        const customer2 = new Customer("456", "Customer 2");
        const adress2 = new Address("Street 2", 456, "13330-250", "São Paulo");
        customer2.changeAddress(adress2);
        customer2.addRewardPoints(20);
        await customerRepository.create(customer2);

        const customers = await customerRepository.findAll();

        expect(customers).toContainEqual(customer1);
        expect(customers).toContainEqual(customer2);
        expect(customers.length).toBe(2);
    });
});