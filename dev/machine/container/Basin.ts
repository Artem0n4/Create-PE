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
      new Animation.Item(this.x + 0.5, this.y + 0.2, this.z + 0.6),
      new Animation.Item(this.x + 0.5, this.y + 0.52, this.z + 0.4),
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
  describeItem(data: ItemStack & { animation: Animation.Item }) {
    if (!data.animation) return;
    data.animation.describeItem({
      id: data.id,
      count: 1,
      data: data.data,
      size: 0.4,
      rotation: [Math.PI / 2, Math.PI / 4, 0],
    });
    data.animation.load();
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    const entity = new PlayerEntity(player);
    if (Entity.getSneaking(player) === true) {
      const selected_slot = this.container.getSlot("slot_" + this.data.selected)
      if (entity.getCarriedItem().id === 0) {
        entity.setCarriedItem(selected_slot); 
      } else {
        entity.addItemToInventory(selected_slot);
      }
      if (this.hasSelected()) {
        this.sendPacket("describeItem", new ItemStack());
      };
      this.container.setSlot("slot_" + this.data.selected, 0, 0, 0)
      return;
    } else {
      this.container.setSlot(
        "slot_" + this.data.selected,
        item.id,
        item.count,
        item.data,
        item.extra
      );
     this.selectedLogic(player);
      entity.decreaseCarriedItem(1);
      if (this.hasSelected()) {
        this.sendPacket("describeItem", item);
      }
      return;
    }
  }
  hasSelected() {
    return this.data.selected === 1 || this.data.selected === 2;
  };
  selectedLogic(player: int) {
    if (this.data.selected < 16) {
      this.data.selected++;
    } else {
      this.data.selected = 0;
    }
  };
  selfDestroy(): void {
    for (let i = 1; i <= 16; i++) {
      const slots = this.container.getSlot("slot_" + i);
      if (slots.id !== 0) {
        this.blockSource.spawnDroppedItem(
          this.x + 0.5,
          this.y + 0.3,
          this.z + 0.5,
          slots.id,
          slots.count,
          slots.data,
          slots.extra
        );
        this.container.setSlot("slot_" + i, 0, 0, 0);
      }
    }
    super.selfDestroy();
  }

  static {
    TileEntity.registerPrototype(Basin.BLOCK.getID(), new Basin());
  }
}
