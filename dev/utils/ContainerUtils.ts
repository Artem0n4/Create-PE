abstract class ContainerUtils {
  protected constructor() {}
  /**
   * abstract class for manipulate your container
   * @name name of your slot
   * @instance your instance object
   * @container your ItemContainer
   * @returns condition
   */
  public static equalSlotByInstance(
    name: string,
    instance: ItemInstance,
    container: ItemContainer
  ) {
    const slot = container.getSlot(name);
    return (
      slot.id === instance.id &&
      slot.count >= instance.count &&
      slot.data === instance.data &&
      slot.extra === (instance.extra || null)
    );
  }
}
