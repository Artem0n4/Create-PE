/// <reference path="C:\Users\Пользователь\Desktop\Игры\HORIZON MODDING KERNEL\Inner Core Mod Toolchain\toolchain\toolchain\declarations\core-engine.d.ts" />
type ArrayVector = [number, number, number];

declare class BlockAnimator {
    public animation;
    public coords: Vector;
    public tile: TileEntity
    constructor(coords: Vector, tile: TileEntity)
    public load();
    public describe(
      mesh: RenderMesh | RenderSide,
      texture: string,
      scale?: number,
      material?: string
    ): void;
    public rotate(x: number, y: number, z: number): void
    public scale(x: number, y: number, z: number): void
    public move(x: number, y: number, z: number, sign: "-" | "+"): void
    public destroy(): void
    public static generateMesh(
      model: string,
      params?: RenderMesh.ImportParams,
      rotate?: ArrayVector
    ): RenderMesh
  }

  declare class RenderSide {
    public list: ReadonlyArray<RenderMesh>;
    public model: string;
    public importParams: RenderMesh.ImportParams
    /**
     * 
     * @model your name of model, model must contains in folder from this path:  
     *  __ dir __ + "/resources/assets/models/"
     * @importParams your render mesh import params, optional. Default is  
     * {
         translate: [0.5, 0.5, 0.5],  
         invertV: false,  
         noRebuild: false,  
       },
     */
    constructor(
       model: string,
       importParams?: RenderMesh.ImportParams
    ) 
    public getRenderMesh(tile: TileEntity): RenderMesh
  }
  