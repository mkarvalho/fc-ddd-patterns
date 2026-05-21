import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import Customer from "../../domain/entity/customer";
import CustomerRepository from "./customer.repository";
import Address from "../../domain/entity/address";
import ProductRepository from "./product.repository";
import Product from "../../domain/entity/product";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import { or } from "sequelize";
import OrderRepository from "./order.repository";

describe('Order repository tests', () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "John Doe");
        const address = new Address("Main Street", 123, "12345", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
            ],
        });
    });

    it('should update an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "John Doe");
        const address = new Address("Main Street", 123, "12345", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();

        await orderRepository.create(order);

        const orderItem2 = new OrderItem("2", product.id, product.name, product.price, 3);

        order.addItem(orderItem2);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
        });

        expect(order.items.length).toBe(2);
        expect(order.total()).toBe(500);
        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
                {
                    id: orderItem2.id,
                    name: orderItem2.name,
                    price: orderItem2.price,
                    quantity: orderItem2.quantity,
                    order_id: order.id,
                    product_id: product.id,
                },
            ],
        });
    });

    it('should find an order', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "John Doe");
        const address = new Address("Main Street", 123, "12345", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();

        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);

        expect(foundOrder.id).toBe(order.id);
    });

    it('should find all orders', async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "John Doe");
        const address = new Address("Main Street", 123, "12345", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 100);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderItem2 = new OrderItem("2", product.id, product.name, product.price, 2);

        const order = new Order("1", customer.id, [orderItem]);
        const order2 = new Order("2", customer.id, [orderItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders.length).toBe(2);
        expect(orders[0].id).toBe(order.id);
        expect(orders[1].id).toBe(order2.id);
    });
});