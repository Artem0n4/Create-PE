abstract class ShaftBase extends KineticBase {
  public defaultValues = {
    placed: "side",
    energy: 0,
    energy_max: 256,
    rotation: 0,
  };
  public static sideDataDescriptor = {
    zero: BlockAnimation.side_rotation.FIRST,
    first: BlockAnimation.side_rotation.SECOND,
    second: BlockAnimation.side_rotation.FIRST,
    third: BlockAnimation.side_rotation.SECOND,
    default: BlockAnimation.side_rotation.FIRST,
  };
  init(): void {
    const animation = new BlockAnimation(
      {
        model: "shaft",
        importParams: {
          noRebuild: false,
          invertV: false,
        },
      },
      {
        pivot_point: {
          x: this.x + 0.5,
          y: this.y + 0.5,
          z: this.z + 0.5,
        },
        texture: "shaft",
        light_pos: {
          x: this.x,
          y: this.y,
          z: this.z,
        },
      }
    ) as BlockAnimation;
    this.data.animation = animation; //мы передаём BlockAnimation
    if (Entity.getSneaking(Player.getLocal()) === true) {
      animation.createAnimation(0, 0, 0);
      this.data.placed = "up";
    } else {
      animation.createAnimationWithSides(this.blockSource, this, ShaftBase.sideDataDescriptor);
    }
    animation.initialize();
    this.restartAnimationByShaft(this.x, this.y, this.z);
  }
  public static defineValue(player) {}

  public rotate(animation: BlockAnimation) {
    if (this.data.placed === "up") {
      return animation.rotate(0, 0.1, 0);
    }

    return animation.rotate();
  }

  destroy(): boolean {
    const animation = this.data.animation as BlockAnimation;
    animation.destroy();
    return false;
  }

  public validateShafts(x, y, z) {
    return (
      this.blockSource.getBlockId(x, y, z) === ECreateTrinket.SHAFT &&
      this.blockSource.getBlockData(x, y, z) ===
        this.blockSource.getBlockData(this.x, this.y, this.z)
    );
  }

  public restart(x, y, z) {
    const tile = TileEntity.getTileEntity(x, y, z);
    const animation = tile.data.animation as BlockAnimation;
    if (tile && tile.data && tile.data.animation) {
      animation.destroy();
      animation.initialize();
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
      k++;
    }

    let d = 1;
    while (tile.validateShafts(tile.x, tile.y, tile.z + d)) {
      tile.restart(tile.x, tile.y, tile.z + d);
      d++;
    }

    let b = 1;
    while (tile.validateShafts(tile.x, tile.y, tile.z - b)) {
      tile.restart(tile.x, tile.y, tile.z - b);
      b++;
    }
    let r = 1;
    while (tile.validateShafts(tile.x, tile.y + r, tile.z)) {
      tile.restart(tile.x, tile.y + r, tile.z);
      r++;
    }

    let m = 1;
    while (tile.validateShafts(tile.x, tile.y - m, tile.z)) {
      tile.restart(tile.x, tile.y - m, tile.z);
      m++;
    }
  }
  public updateSideByClick() {
    const animation = this.data.animation as BlockAnimation;
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

    animation.createAnimationWithSides(this.blockSource, this, ShaftBase.sideDataDescriptor);
    this.data.animation = animation;
    animation.initialize();

    this.restart(this.x, this.y, this.z);
    this.restartAnimationByShaft(this.x, this.y, this.z);
  }
  onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): any {
    if (Entity.getSneaking(player) === true) {
      this.updateSideByClick();
    }
    return false;
  }
}
