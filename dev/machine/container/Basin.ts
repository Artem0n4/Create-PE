class Basin extends TileEntityBase {
  public static readonly BLOCK: CBlock = new CBlock("basin", [
    {
      name: "block.create.basin",
      texture: [
        ["basin", 0],
        ["basin", 0],
        ["basin", 0],
        ["basin", 0],
        ["basin", 0],
        ["basin", 0],
      ],
      inCreative: true,
    },
  ])
    .createWithRotation()
    .setupBlockModel("basin", "basin", [1, 1, 1], [0.5, 0.5, 0.5]);
  public defaultValues = {
    selected: 1,
  };
  public animations: Animation.Item[];
  clientLoad(): void {
    this.animations = [
      new Animation.Item(this.x + 0.5, this.y + 0.5, this.z + 0.6),
      new Animation.Item(this.x + 0.5, this.y + 0.5, this.z + 0.4),
    ];
    this.animations.forEach((v) => v.load());
  }
  clientUnload(): void {
    if (this.animations) {
      this.animations.forEach((v) => v && v.destroy());
    }
  }
  public describeItems(item_1: int, item_2: int) {
    return this.sendPacket("describe", { items: [item_1, item_2] });
  }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  describe(data: { items: [item_1: int, item_2: int] }) {
    this.animations &&
      this.animations.forEach((v, i) => {
        return (
          v.describeItem({
            size: 0.4,
            id: data[i],
            count: 1,
            data: 0,
          }),
          v.load()
        );
      });
    alert("Пакет прилетел!");
    return;
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    const entity = new PlayerEntity(player);
    if (Entity.getSneaking(player) === true) {
      if (item.id === 0) {
        entity.setCarriedItem(this.getSlot(this.data.selected));
      } else {
        entity.addItemToInventory(this.getSlot(this.data.selected));
      }
      this.describeItems(0, 0);
      this.setSelectedSlot(new ItemStack());
      return;
    } else {
      if (item.id !== 0) this.selectingLogic(player);
      this.setSelectedSlot(item);
      entity.decreaseCarriedItem(item.count);
      this.describeItems(
        this.getSlot(this.data.selected).id,
        this.getSlot(this.data.selected - 1).id || 0
      );
      return;
    }
  }
  selectingLogic(player: int) {
    if (this.data.selected < 16) {
      this.data.selected++;
    } else {
      this.data.selected = 0;
    };
    Game.message("selected: " + this.data.selected + " | " + this.getSlot(this.data.selected));
  }
  getSlot(number: int): ItemInstance {
    return this.container.getSlot("slot_" + number);
  }
  setSelectedSlot(stack: ItemInstance) {
    this.container.setSlot(
      "slot_" + this.data.selected,
      stack.id,
      stack.count,
      stack.data,
      stack.extra
    );
    return;
  }
  selfDestroy(): void {
    super.selfDestroy();
  }
  static {
    TileEntity.registerPrototype(Basin.BLOCK.getID(), new Basin());
  }
}
