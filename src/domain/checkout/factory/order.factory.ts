import Order from "../entity/order";
import OrderItem from "../entity/order_item";

interface OrderFactoryProps {
    id: string;
    customerId: string;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        productId: string;
    }[];
}

export default class OrderFactory {
    static create(orderProps: OrderFactoryProps): Order {
        const orderItems = orderProps.items.map(item => new OrderItem(
            item.id,
            item.productId,
            item.name,
            item.price,
            item.quantity
        ));
        return new Order(orderProps.id, orderProps.customerId, orderItems);
    }
}