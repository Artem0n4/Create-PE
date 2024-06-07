class CBlock {
  constructor(
    public id: string,
    public data: Block.BlockVariation[],
    public type?: string | Block.SpecialType
  ) {
    IDRegistry.genBlockID(id);
  }
  public create() {
    Block.createBlock(this.id, this.data, this.type);
    return this;
  }

  public setItemModel(model: string, texture: string, import_params?: RenderMesh.ImportParams) {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      models_dir + model + ".obj",
      "obj",
      import_params || null
    );

    ItemModel.getForWithFallback(BlockID[this.id], 0).setModel(
      mesh,
      "models/" + texture
    );
    return this;
  }

  public setupBlockModel(
    texture: string,
    model: string,
    scale?: [int, int, int],
    translate?: [int, int, int]
  ) {
    const mesh = new RenderMesh(__dir__ + "/resources/assets/models/block/" + (model || texture) + ".obj",
    "obj",
    {
      translate: translate || [0.5, 0, 0.5],
      scale: scale,
      invertV: false,
      noRebuild: false});
    mesh.setBlockTexture(texture, 0);
    const render = new ICRender.Model();
    render.addEntry(new BlockRenderer.Model(mesh));
    BlockRenderer.setStaticICRender(BlockID[this.id], 0, render);
    return this;
  }

  public createWithRotation() {
    IDRegistry.genBlockID(this.id);
    Block.createBlockWithRotation(this.id, this.data, this.type);
    return this;
  }
  public setShapeByData(
    data: int,
    x1: int,
    y1: int,
    z1: int,
    x2: int,
    y2: int,
    z2: int
  ) {
    const render = new BlockRenderer.Model();
    const shape = new ICRender.CollisionShape();
    render.addBox(x1, y1, z1, x2, y2, z2, this.getID(), data);
    shape.addEntry().addBox(x1, y1, z1, x2, y2, z2);
    BlockRenderer.setCustomCollisionShape(this.getID(), data, shape);
    BlockRenderer.setStaticICRender(
      this.getID(),
      data,
      new ICRender.Model(render)
    );
    return this;
  }
  public getID(): int {
    return BlockID[this.id];
  }
}
