interface ICItem {
  id: string;
  texture?: texture;
  name?: name;
  stack?: int;
}

class CItem {
  public id: int;
  constructor(obj: ICItem) {
    this.id = ItemID[obj.id];

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
  private model(model, import_params) {
    const mesh = new RenderMesh();
    mesh.importFromFile(
      models_dir + "item/" + model + ".obj",
      "obj",
      import_params || null
    );
    return mesh;
  }

  public setHandModel(model, texture, import_params?) {
    ItemModel.getForWithFallback(this.id, 0).setHandModel(
      this.model(model, import_params),
      texture ?? model
    );
  }
  public setItemModel(model, texture, import_params?) {
    ItemModel.getForWithFallback(this.id, 0).setModel(
      this.model(model, import_params),
      texture ?? model
    );
  }
  public setInventoryModel(
    model: string,
    texture: string,
    import_params?: {},
    rotation: [int, int, int] = [0, 0, 0]
  ) {
    const mesh = this.model(model, import_params) as RenderMesh;
    mesh.rotate(
      MathHelper.radian(rotation[0]),
      MathHelper.radian(rotation[1]),
      MathHelper.radian(rotation[2])
    );
    ItemModel.getForWithFallback(this.id, 0).setUiModel(mesh, texture ?? model);
  }
}
