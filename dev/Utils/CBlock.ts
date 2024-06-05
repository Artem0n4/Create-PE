class CBlock {
    constructor(public id: string, public data: Block.BlockVariation[], public type?: string | Block.SpecialType) {
      IDRegistry.genBlockID(id);
        
    };
    public create() {
    
      Block.createBlock(
          this.id,
          this.data, this.type
        );
        return this;
    };

     
    public setItemModel(model, texture, import_params?) {

        const mesh = new RenderMesh();
        mesh.importFromFile(
          models_dir + model + ".obj",
          "obj",
          import_params || null
        );

        ItemModel.getForWithFallback(BlockID[this.id], 0).setModel(
          mesh,
          "models/" + texture
        )
          return this;
      };

      public setupBlockModel(texture: string, model: string, scale?: [int, int, int], translate?: [int, int, int]) {
        const mesh = new RenderMesh();
        mesh.setBlockTexture(texture, 0);
        mesh.importFromFile(
          __dir__ + "/resources/assets/models/block/" + (model || texture) + ".obj",
          "obj",
          {
            translate: translate || [0.5, 0, 0.5],
            scale: scale,
            invertV: false,
            noRebuild: false,
          }
        );
        const render = new ICRender.Model();
        render.addEntry(new BlockRenderer.Model(mesh));
        BlockRenderer.setStaticICRender(BlockID[this.id], 0, render);
        return this;
      };

    public createWithRotation() {
        IDRegistry.genBlockID(this.id);
        Block.createBlockWithRotation(
            this.id,
            this.data, this.type
          );
          return this;
    };
    public getID(): int {
      return ItemID[this.id];
    }
}