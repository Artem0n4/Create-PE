
abstract class ShaftBase extends TileEntityBase {
  public defaultValues = {
    placed: "side",
    energy: 0,
    rotation: 0
  };

  public static formingRender(
    rx: ETrinketRotation.X | 0 = Math.PI / 2,
    ry: ETrinketRotation.XY | 0 = 0,
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
      
    let render;

    switch (this.blockSource.getBlockData(this.x, this.y, this.z)) {
      case ETrinketSide.FIRST:
        render = ShaftBase.formingRender();
        this.data.rotation = { x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.SECOND: //SECOND
        render = ShaftBase.formingRender(ETrinketRotation.X, ETrinketRotation.XY);
        this.data.rotation = { x: 0.01, y: 0, z: 0 }; //{ x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.THIRD: //THIRD
        render = ShaftBase.formingRender();
        this.data.rotation = { x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.FOURTH:
        render = ShaftBase.formingRender(ETrinketRotation.X, ETrinketRotation.XY);
        this.data.rotation = { x: 0.01, y: 0, z: 0 }
        break;
      default:
        ShaftBase.formingRender(ETrinketRotation.X);
        this.data.rotation = { x: 0, y: 0, z: 0.01 };
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
    Game.message(this.data.rotation)
    animation.describe({ mesh, skin: "models/block/shaft.png" });
    animation.load();

    this.restartAnimationByShaft(this.x, this.y, this.z);
  }
  public static defineValue(player) {}

  public rotate(animation: Animation.Base) {
    const rotation = this.data.rotation
    animation.load();
    if (this.data.placed === "up") {
      return animation.transform().rotate(0, 0.01, 0),
      animation.refresh();
    };
    if(typeof this.data.rotation === "object") {
   return animation.transform().rotate(rotation.x , rotation.y, rotation.z),
    animation.refresh();
     }
  }

  destroy(): boolean {
    this.data.animation.destroy();
    return false;
  }

  public validateShafts(x, y, z) {
    return (
      this.blockSource.getBlockId(x, y, z) === ECreateTrinket.SHAFT &&
      this.blockSource.getBlockData(x, y, z) ===
        this.blockSource.getBlockData(this.x, this.y, this.z)
    );
  };

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

    let k = 1;
    while (tile.validateShafts(tile.x - k, tile.y, tile.z)) {
      tile.restart(tile.x - k, tile.y, tile.z);
      i++;
    }

    let d = 1;
    while (tile.validateShafts(tile.x, tile.y, tile.z + d)) {
      tile.restart(tile.x, tile.y, tile.z + d);
      i++;
    }

    let b = 1;
    while (tile.validateShafts(tile.x, tile.y, tile.z - b)) {
      tile.restart(tile.x, tile.y, tile.z - b);
      i++;
    };
    let r = 1;
    while (tile.validateShafts(tile.x, tile.y + r, tile.z)) {
      tile.restart(tile.x, tile.y + r, tile.z);
      i++;
    }

    let m = 1;
    while (tile.validateShafts(tile.x, tile.y - m, tile.z)) {
      tile.restart(tile.x, tile.y - m, tile.z);
      i++;
    }
  }

  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): any {

    
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

    this.restart(this.x, this.y, this.z);
    this.restartAnimationByShaft(this.x, this.y, this.z);
        
    return false;
  }
}
