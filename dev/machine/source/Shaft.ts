class Shaft extends TileEntityBase {
  public static readonly BLOCK: CBlock = new CBlock("shaft", [
    {
      name: "block.create.shaft",
      texture: [
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
        ["unknown", 0],
      ],
      inCreative: true,
    },
  ])
    .createWithRotation()
    .setItemModel("item/shaft", "item/shaft", {
      translate: [0.5, 0.5, 0.5],
      scale: [1.1, 1.1, 1.1],
      invertV: false,
      noRebuild: false,
    })
    .setShapeByData(0, 0.375, 0.3, 0, 0.625, 0.7, 1)
    .setShapeByData(2, 0, 0.3, 0.375, 1, 0.7, 0.625)
    .setShapeByData(1, 0.375, 0.3, 0, 0.625, 0.7, 1)
    .setShapeByData(3, 0, 0.3, 0.375, 1, 0.7, 0.625);
  public animation: BlockAnimator;
  public defaultValues = {
    speed: 0,
  };
  public static readonly RENDER_LIST = new RenderSide(
    "block/horizontal_shaft",
    {
      invertV: false,
      noRebuild: false,
      translate: [0, 0, 0],
    }
  );
  public static RENDER_TOP = BlockAnimator.generateMesh(
    "block/horizontal_shaft",
    {
      noRebuild: false,
      invertV: false,
      translate: [0, 0, 0],
    },
    [-Math.PI / 2, 0, 0]
  );
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  describeModel(data: { mesh: RenderMesh | RenderSide<string> }) {
    if (!this.animation) return;
    alert("Пакет прилетел!");
    this.animation.destroy();
    this.animation.describe(data.mesh, "block/shaft");
    this.animation.load();
  } //!
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  rotateModel(data: Vector) {
    if (!this.animation) return;
    this.animation.rotate(data.x, data.y, data.z);
  }
  onTick(): void {
    this.sendPacket("rotateModel", new Vector3(this.x + 0.05, this.y, this.z));
  }
  clientLoad(): void {
    this.animation = new BlockAnimator(
      new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
      this
    );
    this.animation.describe(Shaft.RENDER_LIST, "block/shaft");
    this.animation.load();
  }
  clientUnload(): void {
    this.animation.destroy();
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): any {
    const data = this.blockSource.getBlockData(this.x, this.y, this.z);
    if (Entity.getSneaking(player) === false) {
      this.blockSource.setBlock(
        this.x,
        this.y,
        this.z,
        this.blockID,
        data < 4 ? data + 1 : 0
      );
      return this.sendPacket("describeModel", {
        mesh: Shaft.RENDER_LIST,
      });
    } else {
      this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, 4);
      return this.sendPacket("describeModel", {
        mesh: Shaft.RENDER_TOP,
      });
    }
  }
  public static replay(
    coords: Vector,
    block: Tile,
    changedCoords: Vector,
    region: BlockSource
  ) {
    if (
      region.getBlockId(changedCoords.x, changedCoords.y, changedCoords.z) ===
      Shaft.BLOCK.getID()
    ) {
      const tile = TileEntity.getTileEntity(
        changedCoords.x,
        changedCoords.y,
        changedCoords.z
      );
      if (!tile.animation) return;
      tile.animation.destroy();
      tile.animation.load();
    }
  }
  public static connecting(x, y, z) {
    const block = BlockSource.getCurrentWorldGenRegion().getBlock(x, y, z);
    Game.message("" + block);
    if(block.getId() === Shaft.BLOCK.getID()) {
      this.connecting(x + 1, y, z);
      this.connecting(x - 1, y, z);
      this.connecting(x, y, z - 1);
      this.connecting( x, y, z + 1);
    }
    if (Connection.getInputer(block.getId())) {
      return ProcessingTile.transfer(new Vector3(x, y, z), 250);
    };
  }
  static {
    const id = Shaft.BLOCK.getID();
    TileEntity.registerPrototype(id, new Shaft());
  }
}
