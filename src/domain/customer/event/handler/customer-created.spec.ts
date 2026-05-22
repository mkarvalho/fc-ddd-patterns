
import EventDispatcher from "../../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "../customer-created.event";
import CustomerCreatedOneHandler from "./customer-created-one-handler";
import CustomerCreatedTwoHandler from "./customer-created-two-handler";

describe('Customer Created Handler', () => {
    it("should create a customer and notify the event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventOneHandler = new CustomerCreatedOneHandler();
        const eventTwoHandler = new CustomerCreatedTwoHandler();
        const spyEventOneHandler = jest.spyOn(eventOneHandler, "handle");
        const spyEventTwoHandler = jest.spyOn(eventTwoHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventOneHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventTwoHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventOneHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventTwoHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: "Customer 1",
            address: "Address 1"
        });

        eventDispatcher.notify(customerCreatedEvent);

        expect(spyEventOneHandler).toHaveBeenCalledTimes(1);
        expect(spyEventTwoHandler).toHaveBeenCalledTimes(1);
    });
});