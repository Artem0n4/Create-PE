/// <reference path="C:\Users\Пользователь\Desktop\Игры\HORIZON MODDING KERNEL\Inner Core Mod Toolchain\toolchain\toolchain\declarations\core-engine.d.ts" />
type ArrayVector = [number, number, number];

declare class BlockAnimator {
  public animation: Animation.Base;
  public coords: Vector;
  public tile: TileEntity;
  constructor(coords: Vector, tile: TileEntity);
  public load();
  public describe(
    mesh: RenderMesh | RenderSide<string>,
    texture: string,
    scale?: number,
    material?: string
  ): void;
  public rotate(x: number, y: number, z: number): void;
  public scale(x: number, y: number, z: number): void;
  public setPos(x: number, y: number, z: number): void;
  public destroy(): void;
  /**
   *
   * @model name of your model, writes from: __ dir __ + "assets/models/"
   * @params importParams for your render mesh
   * @rotate rotation for your RenderMesh
   */
  public static generateMesh(
    model: string,
    params?: RenderMesh.ImportParams,
    rotate?: ArrayVector
  ): RenderMesh;
}

declare class RenderSide<T extends string | RenderMesh> {
  public list: ReadonlyArray<RenderMesh>;
  public model: string;
  public importParams: RenderMesh.ImportParams;

  /**
   * 
   * @model your render mesh 
   */
  constructor(model: RenderMesh);

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
   constructor(model: string, importParams?: RenderMesh.ImportParams);
  constructor(model: T, importParams?: RenderMesh.ImportParams);
  public getRenderMesh(tile: TileEntity): RenderMesh;
}
