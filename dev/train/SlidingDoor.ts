class SlidingDoor extends TileEntityBase {
  protected animation: BlockAnimator;
  public static RENDER_LIST = new RenderSide<string>("block/door/door_full", {
    invertV: false,
    noRebuild: false,
    translate: [0, 0, 0],
  });
  protected constructor(texture: string) {
    super();
    this.client.load = function () {
      const animation = (this.animation = new BlockAnimator(
        new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
        this
      ));
      animation.describe(SlidingDoor.RENDER_LIST, texture);
      animation.load();
    };
  }
  clientUnload(): void {
    this.animation && this.animation.destroy();
  }
  defaultValues = {
    timer: 100,
    active: false,
    state: "close",
  };
  rotation: ArrayVector;
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  moveAnimation(data: Vector) {
    if (!this.animation) return;
    this.animation.setPos(data.x, data.y, data.z);
  }
  public moveLogic(pos: Vector) {
    if (this.data.state === "open") {
      return this.sendPacket("moveAnimation", pos);
    } else {
      const inversion = Object.entries(pos).reduce((acc, [key, value]) => {
        acc[key] = -value;
        return acc;
      }, {});
      return this.sendPacket("moveAnimation", inversion);
    }
  }
  onTick(): void {
    if (this.data.active === false || !this.rotation) return;
    const xyz = ["x", "y", "z"];
    const rotation = this.rotation.map((v, i, a) => {
      return v === 1 ? this[xyz[i]] + 0.5 : this[xyz[i]] + (this.data.timer / v);
    });
    const pos = {
      x: rotation[0],
      y: rotation[1],
      z: rotation[2],
    };
    this.moveLogic(pos);
    this.data.timer--;
    if (this.data.timer === 0) {
      this.data.active = false;
      this.data.timer = 100;
      alert("End");
    }
    return;
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    const data = BlockSource.getDefaultForActor(player).getBlockData(
      coords.x,
      coords.y,
      coords.z
    );
    const x = data === 250 || data === 3 ? 250 : 1;
    const z = data === 250 || data === 2 ? 250 : 1;
    this.rotation = [x, 1, z];

    if (this.data.state === "close") {
      this.data.state = "open";
    } else {
      this.data.state = "close";
    }
    this.data.active = true;
    return;
  }
  public static registry(keyword: string, texture: string) {
    const BLOCK = new CBlock(keyword + "_door", [
      {
        name: "block.create." + keyword + "_door",
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
    TileEntity.registerPrototype(
      BLOCK.getID(),
      new SlidingDoor("block/door/" + texture + "_full")
    );
  }
}

SlidingDoor.registry("brass", "brass");
SlidingDoor.registry("andesite", "andesite");
SlidingDoor.registry("copper", "copper");
SlidingDoor.registry("train", "train");
SlidingDoor.registry("framed_glass", "framed_glass");
