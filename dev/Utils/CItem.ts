interface ICItem {
  id: string;
  texture?: texture;
  name?: name;
  stack?: int;
}

class CItem {
  public id: string;
  constructor(obj: ICItem) {
    this.id = obj.id

    const texture = (obj.texture ??= obj.id);
    const meta_num = texture[texture.length - 1];

    IDRegistry.genItemID(obj.id);
    Item.createItem(
      obj.id,
      "item.create." + (obj.name || obj.id),
      {
        name: texture,
        meta: 0,
      },
      {
        stack: obj.stack || 64,
      }
    );
  }
  protected model(model, import_params) {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      models_dir + model + ".obj",
      "obj",
      import_params || null
    );
    return mesh;
  }

  public setHandModel(model_name: string, texture: string, import_params?) {
    const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
    model.setHandModel(
      this.model(model_name, import_params),
      texture
    );

  }
  public setItemModel(model_name: string, texture: string, import_params?) {
    const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
    model.setModel(
      this.model(model, import_params),
      texture
    );

  }
  public setInventoryModel(
    model_name: string,
    texture: string,
    import_params?: {},
    rotation: [int, int, int] = [0, 0, 0]
  ) {
    const mesh = this.model(model_name, import_params) as RenderMesh;
    mesh.rotate(
      MathHelper.radian(rotation[0]),
      MathHelper.radian(rotation[1]),
      MathHelper.radian(rotation[2])
    );
   const model = ItemModel.getForWithFallback(ItemID[this.id], 0);
   model.setUiModel(mesh, texture);
  }
}
