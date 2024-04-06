class CBlock {
    constructor(public id: string, public data, public type?) {
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
          texture
        ).setTexture(texture);

      }
    public createWithRotation() {
        IDRegistry.genBlockID(this.id);
        Block.createBlockWithRotation(
            this.id,
            this.data, this.type
          );
          return this;
    };
}