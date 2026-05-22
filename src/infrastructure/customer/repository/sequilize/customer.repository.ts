
import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements RepositoryInterface<Customer> {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
        });
    }
    async update(entity: Customer): Promise<void> {
        await CustomerModel.update(
            {
                name: entity.name,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
                street: entity.address.street,
                number: entity.address.number,
                zipcode: entity.address.zip,
                city: entity.address.city,
            },
            {
                where: { id: entity.id }
            });
    }
    async find(id: string): Promise<Customer> {
        const customerModel = await CustomerModel.findOne({ where: { id } });

        if (!customerModel) {
            throw new Error("Customer not found");
        }

        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(
            customerModel.street,
            customerModel.number,
            customerModel.zipcode,
            customerModel.city
        );
        customer.changeAddress(address);

        return customer;
    }
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();

        return customerModels.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name);
            const address = new Address(
                customerModel.street,
                customerModel.number,
                customerModel.zipcode,
                customerModel.city
            );
            customer.changeAddress(address);
            customer.addRewardPoints(customerModel.rewardPoints);

            if (customerModel.active) {
                customer.activate();
            }

            return customer;
        });
    }

}