const SHAFT = new CBlock("shaft", [
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
]).createWithRotation();

SHAFT.setItemModel("item/shaft", "item/shaft", {
  translate: [0.5, 0.5, 0.5],
  scale: [1.1, 1.1, 1.1],
  invertV: false,
  noRebuild: false,
});

Callback.addCallback("ItemUse", (coords, item, block, itExternal, player) => {
  Game.message(String(block.id + ": " + block.data));
});

class Shaft extends TileEntityBase {
  public animation: BlockAnimator;
  public defaultValues = {
    speed: 0,
  };
  public static readonly RENDER_LIST = new RenderSide("horizontal_shaft", {
    invertV: false,
    noRebuild: false,
    translate: [0.5, 0, 0.5],
  });
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  updateModel(data: { mesh: RenderMesh }) {
    this.animation.describe(data.mesh, "models/block/shaft.png");
  }
  clientLoad(): void {
    this.animation = new BlockAnimator(
      new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
      this
    );
    this.animation.describe(
      Shaft.RENDER_LIST.getRenderMesh(this),
      "models/block/shaft.png"
    );
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
        mesh: BlockAnimator.generateMesh(
          "horizontal_shaft",
          {
            noRebuild: false,
            invertV: false,
            translate: [0.5, 0, 0.5],
          },
          [-Math.PI / 2, 0, 0]
        ),
      });
    }
  }
}

TileEntity.registerPrototype(ECreateTrinket.SHAFT, new Shaft());

// (() => {
//     const first = new ICRender.CollisionShape();
//     first.addEntry().addBox(0.375, 0.5, 0, 0.625, 0.75, 1);

//     const second = new ICRender.CollisionShape();
//     second.addEntry().addBox(0, 0.5, 0.375, 1, 0.75, 0.625);
//     BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 0, first);
//     BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 1, first); //1, 2 = 90 graduses

//     BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 2, second);
//     BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 3, second)
// })()

setupBlockShapeByData(ECreateTrinket.SHAFT, 0, 0.375, 0.3, 0, 0.625, 0.7, 1);

setupBlockShapeByData(ECreateTrinket.SHAFT, 2, 0.375, 0.3, 0, 0.625, 0.7, 1);

setupBlockShapeByData(ECreateTrinket.SHAFT, 1, 0, 0.3, 0.375, 1, 0.7, 0.625);

setupBlockShapeByData(ECreateTrinket.SHAFT, 3, 0, 0.3, 0.375, 1, 0.7, 0.625);

Callback.addCallback("LevelDisplayed", () => {
  Block.setDestroyLevelForID(ECreateTrinket.SHAFT, EDestroyLevel.WOOD);
});
