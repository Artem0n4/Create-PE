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
      new Animation.Item(this.x + 0.5, this.y + 1.2, this.z + 0.6),
      new Animation.Item(this.x + 0.5, this.y + 1.3, this.z + 0.4),
    ];
    this.animations[0].load();
    this.animations[1].load();
  }
  clientUnload(): void {
    if (this.animations) {
      this.animations[0].destroy();
      this.animations[1].destroy();
    }
  }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  describeItem(data: ItemStack & { number: int }) {
    const animation = this.animations[data.number];
    animation.describeItem({
      id: data.id,
      count: 1,
      data: data.data,
      size: 0.4,
      rotation: [Math.PI / 2, Math.PI / 4, 0],
    });
    animation.load();
    alert("Пакет прилетел!");
    return;
  }
  public sendVisual(stack: ItemStack, number: int) {
    return this.sendPacket("describeItem", {
      id: stack.id,
      count: stack.count,
      data: stack.data,
      number,
    });
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    const entity = new PlayerEntity(player);
    if (Entity.getSneaking(player) === true) {
      if (item.id === 0) {
        entity.setCarriedItem(this.getSelectedSlot());
      } else {
        entity.addItemToInventory(this.getSelectedSlot());
      }
      if (this.hasSelected()) {
        this.sendVisual(new ItemStack(), 0);
        this.sendVisual(new ItemStack(), 1);
      }
      this.setSelectedSlot(new ItemStack());
      return;
    } else {
      if (item.id !== 0) this.selectingLogic(player);
      this.setSelectedSlot(item);
      entity.decreaseCarriedItem(item.count);
      if (this.hasSelected()) {
        this.sendVisual(item, 0);
        this.sendVisual(item, 1);
      }
      return;
    }
  }
  hasSelected() {
    Game.message(this.data.selected);
    return this.data.selected === 1 || this.data.selected === 2;
  }
  selectingLogic(player: int) {
    if (this.data.selected < 16) {
      this.data.selected++;
    } else {
      this.data.selected = 0;
    }
  }
  getSelectedSlot(): ItemInstance {
    return this.container.getSlot("slot_" + this.data.selected);
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
