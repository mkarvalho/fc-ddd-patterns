import EventDispatcher from "../../@shared/event-dispatcher";
import CustomerAddressChangedEvent from "../customer-address-changed.event";
import CustomerAddressChangedHandler from "./customer-address-changed-handler";

describe("Customer Address Changed Handler", () => {
    it("should change the customer address and notify the event", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new CustomerAddressChangedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "1",
            name: "Customer 1",
            address: "Address 1"
        });

        eventDispatcher.notify(customerAddressChangedEvent);

        expect(spyEventHandler).toHaveBeenCalledTimes(1);

    });
});