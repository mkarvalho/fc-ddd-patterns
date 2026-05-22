
import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe('Order service unit tests', () => {
    it("should get total of all orders", () => {
        const orderItem1 = new OrderItem("item1", "product1", "Item 1", 100, 1);
        const orderItem2 = new OrderItem("item2", "product2", "Item 2", 200, 2);

        const order = new Order("order1", "customer1", [orderItem1]);
        const order2 = new Order("order2", "customer1", [orderItem2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });

    it("should place an order", () => {
        const customer = new Customer("customer1", "Customer 1");
        const item1 = new OrderItem("item1", "product1", "Item 1", 10, 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);
    });
});