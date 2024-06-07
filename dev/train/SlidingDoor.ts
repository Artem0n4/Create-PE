class SlidingDoor extends TileEntityBase {
  protected constructor() {
    super();
  }
  public static RENDER_LIST = new RenderSide<string>("block/door/door_full", {
    invertV: false,
    noRebuild: false,
    translate: [0, 0, 0],
  });
  public static list = [];
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
    SlidingDoor.list[BLOCK.getID()] = "/block/door/" + texture;
    TileEntity.registerPrototype(BLOCK.getID(), new SlidingDoor());
  }
  protected animation: BlockAnimator;
  clientLoad(): void {
    this.animation = new BlockAnimator(
      new Vector3(this.x + 0.5, this.y + 0.5, this.z + 0.5),
      this
    );
    this.animation.describe(
      SlidingDoor.RENDER_LIST,
      SlidingDoor.list[
        BlockSource.getCurrentWorldGenRegion().getBlockId(
          this.x,
          this.y,
          this.z
        )
      ]
    );
    this.animation.load();
  }
  clientUnload(): void {
    this.animation && this.animation.destroy();
  }
  defaultValues = {
    timer: 320,
    active: false,
    state: "close",
  };
  rotation: ArrayVector;
  @BlockEngine.Decorators.NetworkEvent(Side.Client)
  moveAnimation(data: Vector) {
    if (!this.animation) return;
    this.animation.setPos(data.x, data.y, data.z);
  }
  onTick(): void {
    if (this.data.active === false) return;
    const timer = this.data.timer;
    const pos = {
      x: this.x + timer / this.rotation[0],
      y: this.y + timer / this.rotation[1],
      z: this.z + timer / this.rotation[2],
    };
    if (this.data.state === "open") {
      this.sendPacket("moveAnimation", pos);
    } else {
      const keys = Object.keys(pos);
      this.sendPacket(
        "moveAnimation",
        Object.values(pos).reduce((pv, cv: number, ci) => {
          pv[keys[ci]] = cv * -1;
          return pv;
        }, {})
      );
    }
    this.data.timer--;
    if (this.data.timer === 0) {
      this.data.active = false;
      this.data.timer = 320;
      alert("End");
    }
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): boolean {
    let rotation = [0, 0, 0] as ArrayVector;
    switch (
      BlockSource.getDefaultForActor(player).getBlockData(
        coords.x,
        coords.y,
        coords.z
      )
    ) {
      case 0:
        rotation = [20, 0, 0];
        break;
      case 1:
        rotation = [0, 0, 20];
        break;

      case 2:
        rotation = [0, 0, 20];
        break;

      case 3:
        rotation = [20, 0, 0];
        break;
    }
    this.rotation = rotation;
    if (this.data.state === "close") {
      this.data.state = "open";
    } else {
      this.data.state = "close";
    }
    this.data.active = true;
    return;
  }
}

SlidingDoor.registry("brass", "brass_door_full");
