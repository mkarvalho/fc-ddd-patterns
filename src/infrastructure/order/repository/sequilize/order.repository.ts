import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import RepositoryInterface from "../../../../domain/@shared/repository/repository-interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements RepositoryInterface<Order> {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                product_id: item.productId,
            })),
        },
            {
                include: [{ model: OrderItemModel }],
            }
        );
    }
    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            },
            {
                where: { id: entity.id },
            }
        );

        await OrderItemModel.destroy({
            where: { order_id: entity.id },
        });

        await OrderItemModel.bulkCreate(
            entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                order_id: entity.id,
                product_id: item.productId,
            }))
        );
    }
    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: [{ model: OrderItemModel }],
        });

        if (!orderModel) {
            throw new Error("Order not found");
        }

        return new Order(
            orderModel.id,
            orderModel.customer_id,
            orderModel.items.map(item => new OrderItem(
                item.id,
                item.product_id,
                item.name,
                item.price,
                item.quantity
            ))
        );
    }
    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        });

        return orderModels.map(orderModel =>
            new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map(item => new OrderItem(
                    item.id,
                    item.product_id,
                    item.name,
                    item.price,
                    item.quantity
                ))
            )
        );
    }
}