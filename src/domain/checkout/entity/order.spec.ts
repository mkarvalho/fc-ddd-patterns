import Order from "./order";
import OrderItem from "../entity/order_item";

describe("Order unit tests", () => {
    it("should throw an error when id is empty", () => {
        expect(() => {
            new Order("", "1", []);
        }).toThrow("Id is required");
    });

    it("should throw an error when customerId is empty", () => {
        expect(() => {
            new Order("1", "", []);
        }).toThrow("CustomerId is required");
    });

    it("should throw an error when items is empty", () => {
        expect(() => {
            new Order("1", "1", []);
        }).toThrow("Items are required");
    });

    it("should calculate total", () => {
        const item = new OrderItem("1", "p1", "Product 1", 100, 2);
        const item2 = new OrderItem("2", "p2", "Product 2", 200, 2);
        const order = new Order("o1", "c1", [item]);

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("o2", "c1", [item, item2]);

        total = order2.total();
        expect(total).toBe(600);
    });

    it("should throw an error when item quantity is less than or equal to zero", () => {
        expect(() => {
            const item = new OrderItem("1", "p1", "Product 1", 100, 0);
            new Order("o1", "c1", [item]);
        }).toThrow("Quantity must be greater than zero");
    });
});