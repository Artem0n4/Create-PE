interface IRenderMeshDescriptor {
  /**
   * model name without block/   
   * for example: "shaft"
   */
  model: string;
  /**
   * rotation in gradus
   */
  rotation?: { x: int; y: int; z: int };
  importParams: {
    scale?: [int, int, int];
    translate?: [int, int, int];
    noRebuild: boolean;
    invertV: boolean;
  };
}

interface IAnimationBaseDescriptor {
  readonly pivot_point: coords_xyz;
  readonly texture: string;
  readonly light_pos: coords_xyz;
}

interface IDataRotationDescriptor {
  zero: coords_xyz,
  first: coords_xyz,
  second: coords_xyz,
  third: coords_xyz,
  default: coords_xyz
};

class BlockAnimation {
  public mesh: IRenderMeshDescriptor;
  public animation: IAnimationBaseDescriptor;
  public static side_rotation = {
    /** {  
      x: 90,  
      y: 0,   
      z: 0,  
    }  
     */
    FIRST: {
      x: 90,
      y: 0,
      z: 0,
    },
        /** {  
      x: 90,  
      y: 90,  
      z: 0,  
    }
     */
    SECOND: {
      x: 90,
      y: 90,
      z: 0,
    },
  };
  constructor(
    mesh: IRenderMeshDescriptor,
    animation: IAnimationBaseDescriptor
  ) {
    mesh.rotation = mesh.rotation || {x: 0, y: 0, z: 0};
 this.mesh = mesh;
 this.animation = animation;
  }
  /**
   * input rotation with graduses
   * @rotation_optional your rotation, combining for rotation declared in constructor
   * @returns RenderMesh
   */
  protected generateMesh(
    x, y, z
  ): RenderMesh {
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
      MathHelper.radian((rotation.x) + (x || 0)),
      MathHelper.radian((rotation.y) + (y || 0)),
      MathHelper.radian((rotation.z) + (z || 0))
    );
    return mesh;
  }
  public createAnimation(x: int, y: int, z: int): Animation.Base {
    const { pivot_point, texture, light_pos } = this.animation;
    const mesh = this.generateMesh(x, y, z);
    const animation = new Animation.Base(
      pivot_point.x,
      pivot_point.y,
      pivot_point.z
    );
    animation.describe({ mesh, skin: "models/block/" + texture + ".png" });
    animation.setBlockLightPos(light_pos.x, light_pos.y, light_pos.z);
    this[this.mesh.model] = animation;
    return animation;
    
  };

  /**
   * must be load before createAnimation()
   * 
   */
  public getAnimationBase(): Animation.Base {
    const model = this[this.mesh.model] as Animation.Base;
      return model && this[this.mesh.model]
  };

  public createAnimationWithSides(blockSource: BlockSource, coords: TileEntity, data: IDataRotationDescriptor = {
    zero: { x: 0, y: 0, z: 0 },
    first: { x: 0, y: 90, z: 0 },
    second: { x: -180, y: 0, z: 0 },
    third: { x: 0, y: -90, z: 0 },
    default: { x: 0, y: 0, z: 0 },
  }): Animation.Base {
    const that = this;
    const animation = (rotate: coords_xyz, rx, ry, rz) => {
      const obj = {
        x: rotate.x || 0,
        y: rotate.y || 0,
        z: rotate.z || 0,
      };
 
      that["rotation"] = {x: rx, y: ry, z: rz} 
      //rotate is rotate by side, rotation its coords to dynamic rotation 
      return that.createAnimation(obj.x, obj.y, obj.z);
    };

    let render;

    switch (blockSource.getBlockData(coords.x, coords.y, coords.z)) {
      case ETrinketSide.FIRST:
        render = animation(data.zero, 0, 0, 0.01);
        break;
      case ETrinketSide.THIRD: //SECOND
        render = animation(data.second, 0, 0, 0.01);
        break;
      case ETrinketSide.SECOND: //THIRD
        render = animation(data.first, 0.01, 0, 0);
        break;
      case ETrinketSide.FOURTH:
        render = animation(data.third, 0.01, 0, 0);
        break;
      default:
        render = animation(data.default, 0, 0, 0.01);
    }
    return render;
  }
  public rotate(x?: int, y?: int, z?: int) {
    const animation = this[this.mesh.model] as Animation.Base;
    const rotation = this["rotation"] as coords_xyz;
    if (animation && !!animation && rotation && typeof rotation === 'object') {
      animation.load();
      animation
        .transform()
        .rotate(
          x || rotation.x,
         y || rotation.y,
           z || rotation.z
        );
      animation.refresh();
    }
  };

  public rotateBySumm(x?: int, y?: int, z?: int) {
    const validateCoord = (rotate: int, coord: int) => 
       rotate > 0 ? rotate + coord : 0;

    const rotation = this["rotation"] as coords_xyz;
       return this.rotate(validateCoord(rotation.x, x), validateCoord(rotation.y, y), validateCoord(rotation.z, z))
  };
  public initialize() {
    const animation = this[this.mesh.model] as Animation.Base;
   return animation && animation.load();
  };
  public destroy() {
    const animation = this[this.mesh.model] as Animation.Base;
   return animation && animation.destroy();
  }
}
