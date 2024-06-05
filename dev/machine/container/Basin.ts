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
    item: 0,
    count: 0,
    data: 0,
  };
  public animation: Animation.Item;
  clientLoad(): void {
    this.animation = new Animation.Item(this.x + 0.5, this.y + 0.2, this.z + 0.5);
    this.animation.load();
    alert("this.animation: " + this.animation)
  }
  clientUnload(): void {
    this.animation && this.animation.destroy();
  }
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  describeItem(data: ItemStack) {
    if (!this.animation) return;
    this.animation.describeItem({
      id: data.id,
      count: 1,
      data: data.data,
      size: 0.4,
      rotation: [Math.PI / 2, Math.PI / 4, 0],
    });
    this.animation.load();
    alert("Пакет прилетел! stack: " + data);
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    const entity = new PlayerEntity(player);
    if (Entity.getSneaking(player) === true) {
      if (entity.getCarriedItem().id === 0) {
        entity.setCarriedItem(this.data as ItemInstance);
      } else {
        entity.addItemToInventory(this.data as ItemInstance);
      };
      this.sendPacket("describeItem", new ItemStack());
      return;
    } else {
      this.data.id = item.id;
      this.data.count = item.count;
      this.data.data = item.data;
      entity.decreaseCarriedItem(1);
      this.sendPacket("describeItem", item);
      return;
    }
  }
  selfDestroy(): void {
    if (new ItemStack(this.data as ItemInstance).isEmpty()) return;
    this.blockSource.spawnDroppedItem(
      this.x + 0.5,
      this.y + 0.3,
      this.z + 0.5,
      this.data.id,
      this.data.count,
      this.data.data
    );
    alert("ItemStack не пустой!)-")
    super.selfDestroy();
  }
  public static getItemStack(coords: Vector): ItemStack {
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z);
    if (tile && tile.data) {
      return new ItemStack(tile.data as ItemInstance);
    }
    return null;
  }
  public static setItemStack(coords: Vector, stack: ItemStack) {
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z);
    if (tile && tile.data) {
      tile.data.id = stack.id;
      tile.data.count = stack.count;
      tile.data.data = stack.data;
    }
  };
  static {
    TileEntity.registerPrototype(Shaft.BLOCK.getID(), new Shaft());
  }
}
