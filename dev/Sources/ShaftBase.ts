enum EShaftRotation {
  X = Math.PI / 2,
  /**
   * must use also using X
   */
  XY = Math.PI / 2,
  Z = 0,
}

enum EShaftSide {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
  FOURTH = 3,
}

abstract class ShaftBase extends TileEntityBase {
  public defaultValues = {
    placed: "side",
    HF: 0,
  };

  public static formingRender(
    rx: EShaftRotation.X | 0 = Math.PI / 2,
    ry: EShaftRotation.XY | 0 = 0,
    rz: int = 0,
    y = 0.5
  ) {
    const mesh = new RenderMesh();
    mesh.importFromFile(models_dir + "block/shaft" + ".obj", "obj", {
      scale: null,
      invertV: false,
      noRebuild: false,
    });

    mesh.rotate(rx, ry, rz);

    return mesh;
  }

  public formingRenderBySides(player) {
    if (Entity.getSneaking(player) === true) {
      this.data.placed = "up";
      return ShaftBase.formingRender(0, 0, 0, 0);
    }

    let render;

    switch (this.blockSource.getBlockData(this.x, this.y, this.z)) {
      case EShaftSide.FIRST:
        render = ShaftBase.formingRender();
        break;
      case EShaftSide.SECOND: //SECOND
        render = ShaftBase.formingRender(EShaftRotation.X, EShaftRotation.XY);
        break;
      case EShaftSide.THIRD: //THIRD
        render = ShaftBase.formingRender();
        break;
      case EShaftSide.FOURTH:
        render = ShaftBase.formingRender(EShaftRotation.X, EShaftRotation.XY);
        break;
      default:
        ShaftBase.formingRender(EShaftRotation.X);
    }

    return render;
  }

  init(): void {
    const animation = (this.data.animation = new Animation.Base(
      this.x + 0.5,
      this.y + 0.5,
      this.z + 0.5
    ));
    const mesh = this.formingRenderBySides(Player.getLocal()); //?
    animation.describe({ mesh, skin: "models/block/shaft.png" });
    animation.load();

    this.restartAnimationByShaft(this.x, this.y, this.z);
  }
  public static defineValue(player) {}

  public rotate(animation: Animation.Base) {
    const rotation = this.validateRotation();
    animation.load();
    if (this.data.placed === "up")
      return animation.transform().rotate(0, 0.01, 0);
    animation.transform().rotate(rotation.x, rotation.y, rotation.z);
    animation.refresh();
  }

  public validateRotation() {
    let coords: Record<string, number> = {};
    switch (this.blockSource.getBlockData(this.x, this.y, this.z)) {
      case EShaftSide.FIRST:
        coords = { x: 0, y: 0, z: 0.01 };
        break;
      case EShaftSide.FOURTH:
        coords = { x: 0.01, y: 0, z: 0 };
        break;
      case EShaftSide.SECOND:
        coords = { x: 0, y: 0, z: 0.01 };
        break;
      case EShaftSide.THIRD:
        coords = { x: 0, y: 0, z: 0.01 };
        break;
    }
    return coords;
  }

  public onTick(): void {
    if (!this.data.animation) return;

    // if(this.data.HF > 0)
    this.rotate(this.data.animation);
  }

  destroy(): boolean {
    this.data.animation.destroy();
    return false;
  }

  public validateShafts(x, y, z) {
    return (
      this.blockSource.getBlockId(x, y, z) === BlockID["shaft"] &&
      this.blockSource.getBlockData(x, y, z) ===
        this.blockSource.getBlockData(this.x, this.y, this.z)
    );
  }

  public restart(x, y, z) {
    const tile = TileEntity.getTileEntity(x, y, z);
    if (tile && tile.data && tile.data.animation) {
      tile.data.animation.destroy();
      tile.data.animation.load();
    }
  }

  public restartAnimationByShaft(x, y, z) {
    const tile: TileEntity = TileEntity.getTileEntity(
      x,
      y,
      z,
      this.blockSource
    );
    let i = 1;

    while (tile.validateShafts(tile.x + i, tile.y, tile.z)) {
      tile.restart(tile.x + i, tile.y, tile.z);
      i++;
    }

    while (tile.validateShafts(tile.x - i, tile.y, tile.z)) {
      tile.restart(tile.x - i, tile.y, tile.z);
      i++;
    }

    while (tile.validateShafts(tile.x, tile.y, tile.z + i)) {
      tile.restart(tile.x, tile.y, tile.z + i);
      i++;
    }

    while (tile.validateShafts(tile.x, tile.y, tile.z - i)) {
      tile.restart(tile.x, tile.y, tile.z - i);
      i++;
    }
  }

  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): any {
    if (Entity.getSneaking(player) === true) {
      this.restart(this.x, this.y, this.z);
      return this.restartAnimationByShaft(this.x, this.y, this.z);
    }
    const animation = this.data.animation as Animation.Base;
    animation.destroy();
    const data = this.blockSource.getBlockData(this.x, this.y, this.z);
    this.blockSource.setBlock(
      this.x,
      this.y,
      this.z,
      this.blockID,
      data < 3 ? data + 1 : data - 1
    );
    TileEntity.addTileEntity(this.x, this.y, this.z, this.blockSource);

    animation.load();
    const mesh = this.formingRenderBySides(Player.getLocal()); //?
    animation.describe({ mesh, skin: "models/block/shaft.png" });
    animation.load();

    return false;
  }
}
