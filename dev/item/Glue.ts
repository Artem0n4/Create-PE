const meshes = [] as RenderMesh[];
Callback.addCallback("ItemUse", (coords, item, block, ie, player) => {
    if (Entity.getSneaking(player) === false) {
     Game.message("Добавлено! " + block.id)
      meshes.push(ItemModel.getItemRenderMeshFor(block.id, 1, 0, false));
      Game.message(JSON.stringify(meshes))
    } else {
      const result = meshes.reduce((pv, cv, ci, a) => {
        pv.addMesh(cv, coords.x + 16, coords.y + 16, coords.z);
        pv.addMesh(cv, ci * 16, ci * 16, 0);
        return pv;
      }, new RenderMesh());
      const animation = new Animation.Base(coords.x + 0.5, coords.y + 1.5, coords.z + 0.5);
      animation.describe({mesh: result, skin: "atlas::terrain", scale: 1.5});
      animation.load();
    }
  }); //!
  