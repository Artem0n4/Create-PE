enum EShaftRotation {
    X = Math.PI / 2,
    /**
     * must use also using X
     */
    XY = Math.PI / 2,
    Z = 0,
};

enum EShaftSide {
    FIRST = 0,
    SECOND = 1,
    THIRD = 2,
    FOURTH = 3,
};

abstract class ShaftBase extends TileEntityBase {
  public defaultValues = {
    rotation: EShaftRotation,
    HF: 0,
  };

  public static formingRender(
    rx: EShaftRotation.X | 0 = Math.PI / 2,
    ry: EShaftRotation.XY | 0 = 0,
    rz: int = 0,
    y = 1.5
  ) {

    this["rotation"] = ObjectValues(arguments);
    Game.message(this["rotation"])
    const mesh = new RenderMesh();
    mesh.importFromFile(models_dir + "block/shaft" + ".obj", "obj", {
      translate: [0.5, y, 0.5],
      scale: null,
      invertV: false,
      noRebuild: false,
    });

    mesh.rotate(rx, ry, rz);

    return mesh;
  }

  public formingRenderBySides(player) {

    if (Entity.getSneaking(player) === true) {
        return ShaftBase.formingRender(0, 0, 0, 0.5);
    }

    let render;

    switch (this.blockSource.getBlockData(this.x, this.y, this.z)) {
      case EShaftSide.FIRST:
        render = ShaftBase.formingRender();
        break;
      case EShaftSide.SECOND:
        render = ShaftBase.formingRender(EShaftRotation.X, EShaftRotation.XY);
        break;
      case EShaftSide.THIRD:
        render = ShaftBase.formingRender();
        break;
      case EShaftSide.FOURTH:
        render = ShaftBase.formingRender(EShaftRotation.X, EShaftRotation.XY);
        break;
    };

    return render;
  }

  init(): void {
      const animation = (this["animation"] = new Animation.Base(this.x, this.y, this.z));
      const mesh = this.formingRenderBySides(Player.getLocal());  //?
      animation.describe({mesh,
    skin: "models/block/shaft.png"});
    animation.load();
  };
  public static defineValue(player) {}

  public rotate(animation: Animation.Base) {
    const rotation = this.validateRotation();
    animation.load();
    animation.transform().rotate(rotation[0], rotation[1], rotation[2]);
    animation.refresh();
  };

  public validateRotation(): [int, int, int] {
    const rotation: [rx: int, ry: int, rz: int] = this["rotation"];
    const z = rotation[0] > 0 && rotation[1] === 0 ? 0.01 : 0;
    const y = rotation[0] > 0 && rotation[1] > 0 ? 0.01 : 0;
   return [0, y, z]
  };

  public onTick(): void {
      if(!this["animation"]) return;
 
   // if(this.data.HF > 0)
     this.rotate(this["animation"]);
  };

  destroy(): boolean {
      this["animation"].destroy();
      return false;
  }
}
