interface IAnimationBaseDescriptor {
  model: string;
  texture: string;
  pivot_point?: { x: int; y: int; z: int };
  importParams?: {
    scale: [int, int, int], translate: [int, int, int]
  };
  rotation?: [int, int, int]
};

class BlockAnimation extends TileEntityBase {

    constructor() {
      super();
    };
    protected generateMesh(descriptor: Omit<IAnimationBaseDescriptor, 'texture' | 'pivot_point'>): RenderMesh {
      const {importParams, rotation} = descriptor;
      const mesh = new RenderMesh();
      mesh.importFromFile(
        models_dir + "block/" + descriptor.model + ".obj",
        "obj",
        {
          noRebuild: false,
          invertV: false,
          scale: importParams.scale || null,
          translate: importParams.translate || [0, 0, 0]
        }
      );
      mesh.rotate(rotation[0], rotation[1], rotation[2])
      return mesh
    };
    protected createAnimation(descriptor: IAnimationBaseDescriptor): Animation.Base {
    const {pivot_point, texture} = descriptor;
      const mesh = this.generateMesh(descriptor);
      const animation = (this[descriptor.model] = new Animation.Base(pivot_point.x, pivot_point.y, pivot_point.z))
      animation.describe({mesh, skin: texture});
      return animation;
    };
    protected createAnimationWithSides(descriptor: IAnimationBaseDescriptor) {
       const animation = () => this.createAnimation(descriptor) //доделать
    let render;

    switch (this.blockSource.getBlockData(this.x, this.y, this.z)) {
      case ETrinketSide.FIRST:
        render = this.createAnimation(descriptor);
        this.data.rotation = { x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.SECOND: //SECOND
      render = this.createAnimation(descriptor);
        this.data.rotation = { x: 0.01, y: 0, z: 0 }; //{ x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.THIRD: //THIRD
      render = this.createAnimation(descriptor);
        this.data.rotation = { x: 0, y: 0, z: 0.01 };
        break;
      case ETrinketSide.FOURTH:
        render = this.createAnimation(descriptor);
        this.data.rotation = { x: 0.01, y: 0, z: 0 }
        break;
      default:
        render = this.createAnimation(descriptor);
        this.data.rotation = { x: 0, y: 0, z: 0.01 };

    }

    return render;
    }
    protected initializeAnimation(model: string) {
         const animation = this[model] as Animation.Base;
         animation.load();
    }
  }
  