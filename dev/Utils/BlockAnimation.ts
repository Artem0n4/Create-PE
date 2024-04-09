interface IRenderMeshDescriptor {
  model: string;
  /**
 * rotation in gradus
 */
  rotation: { x: int; y: int; z: int };
  importParams: {
    scale: [int, int, int];
    translate: [int, int, int];
    noRebuild: boolean;
    invertV: boolean;
  };
}

interface IAnimationBaseDescriptor {
  readonly pivot_point: coords_xyz;
  readonly texture: string;
  readonly light_pos: coords_xyz;
}



class BlockAnimation {
  public static side_rotation = {
    FIRST: {
      x: 90, y: 0, z: 0
    },
    SECOND: {
      x: 90, y: 90, z: 0
    },
  }
  constructor(
    public mesh: IRenderMeshDescriptor,
    public animation: IAnimationBaseDescriptor
  ) {}
  /**
   * input rotation with graduses
   * @rotation_optional your rotation, combining for rotation declared in constructor 
   * @returns RenderMesh
   */
  protected generateMesh(rotation_optional: coords_xyz = {
    x: 0, y: 0, z: 0
  }): RenderMesh {
    const { importParams, rotation } = this.mesh;
    const mesh = new RenderMesh();
    mesh.importFromFile(
      models_dir + "block/" + this.mesh.model + ".obj",
      "obj",
      {
        noRebuild: false,
        invertV: false,
        scale: importParams.scale || null,
        translate: importParams.translate || [0, 0, 0],
      }
    );
    mesh.rotate(
      MathHelper.radian((rotation.x || 0) + rotation_optional.x),
      MathHelper.radian((rotation.y || 0) + rotation_optional.y),
      MathHelper.radian((rotation.z || 0) + rotation_optional.z)
    );
    return mesh;
  }
  protected createAnimation(rotation: rotation): Animation.Base {
    const { pivot_point, texture, light_pos } = this.animation;
    const mesh = this.generateMesh(rotation);
    const animation = new Animation.Base(
      pivot_point.x,
      pivot_point.y,
      pivot_point.z
    );
    animation.describe({ mesh, skin: texture });
    animation.setBlockLightPos(light_pos.x, light_pos.y, light_pos.z);
    return animation;
  }
  protected createAnimationWithSides(blockSource: BlockSource, x, y, z) {
    const that = this;
    const animation = (rotate: coords_xyz) => {
      const obj = {
        x: rotate.x || 0,
        y: rotate.y || 0,
        z: rotate.z || 0,
      };
      that.createAnimation(
        obj);
      this["rotation"] = ((!!rotate.x && !!rotate.y) ? {
        x: 0.1, y: 0, z: 0 
      } : {
        x: 0, y: 0, z: 0.1
      }) as coords_xyz;
    };

    let render;

    
    switch (blockSource.getBlockData(x, y, z)) {
      case ETrinketSide.FIRST:
        render = this.createAnimation(BlockAnimation.side_rotation.FIRST);
        break;
      case ETrinketSide.SECOND: //SECOND
        render = this.createAnimation(
          BlockAnimation.side_rotation.SECOND
        );
        break;
      case ETrinketSide.THIRD: //THIRD
        render = this.createAnimation(BlockAnimation.side_rotation.FIRST);
        break;
      case ETrinketSide.FOURTH:
        render = this.createAnimation(BlockAnimation.side_rotation.SECOND);
        break;
      default:
        render = this.createAnimation(BlockAnimation.side_rotation.FIRST);
    }

    return render;
  };
  public rotateAnimation(rotate: coords_xyz) {
    const animation = this[this.mesh.model] as Animation.Base
    if(animation && !!animation) {
      animation.load();
      animation.transform().rotate(rotate.x, rotate.y, rotate.z)
      animation.refresh();
    }
  }
  public initializeAnimation() {
    const animation = this[this.mesh.model] as Animation.Base;
    animation.load();
  };
}
