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
    });

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
  updateModel(data: { mesh: RenderMesh | RenderSide }) {
    const animation = this.animation;
    if (!animation) return;
    alert("Пакет прилетел!");
    animation.load();
    animation.describe(data.mesh, "block/shaft");
    animation.load();
  } //!
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
      this.sendPacket("updateModel", {
        mesh: Shaft.RENDER_LIST.getRenderMesh(this),
      });
    } else {
      this.blockSource.setBlock(this.x, this.y, this.z, this.blockID, 4);
      this.sendPacket("updateModel", {
        mesh: Shaft.RENDER_TOP,
      });
    }
  }
  public static connecting(
    block: Tile,
    region: BlockSource,
    coords: Vector,
  ) {
    if (
      region.getBlockId(coords.x, coords.y, coords.z) !==
      Connection.connecting_list[IDRegistry.getNameByID(block.id)]
    ) {
      return;
    }
    const tile = TileEntity.getTileEntity(
      coords.x,
      coords.y,
      coords.z
    ) as TileEntity & { animation: BlockAnimator };
    if (tile && tile.animation) {
      tile.animation.rotate(0.01, 0, 0);
    };
    Game.message("test: " + coords)
    const side_pos: Vector[] = [
      new Vector3(coords.x, coords.y - 1, coords.z),
      new Vector3(coords.x, coords.y + 1, coords.z),
      new Vector3(coords.x + 1, coords.y, coords.z),
      new Vector3(coords.x -1, coords.y, coords.z),
      new Vector3(coords.x, coords.y, coords.z + 1),
      new Vector3(coords.x, coords.y, coords.z - 1),
    ];
    side_pos.forEach((value: Vector) => {
      this.connecting(block, region, value);
    });
  }
  static {
    const id = Shaft.BLOCK.getID();
    TileEntity.registerPrototype(id, new Shaft());
    setupBlockShapeByData(id, 0, 0.375, 0.3, 0, 0.625, 0.7, 1);
    setupBlockShapeByData(id, 2, 0, 0.3, 0.375, 1, 0.7, 0.625);
    setupBlockShapeByData(id, 1, 0.375, 0.3, 0, 0.625, 0.7, 1);
    setupBlockShapeByData(id, 3, 0, 0.3, 0.375, 1, 0.7, 0.625);
    Connection.registerTrinket(id);
    Block.registerClickFunctionForID(id, (coords, item, block, player) => {
      Shaft.connecting({id, data: 0}, BlockSource.getDefaultForActor(player), coords)
      return;
    })
  }
}

Callback.addCallback("LevelDisplayed", () => {
  Block.setDestroyLevelForID(ECreateTrinket.SHAFT, EDestroyLevel.WOOD);
});
