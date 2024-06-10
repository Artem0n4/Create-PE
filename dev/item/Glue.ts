abstract class Glue {
  public static ITEM = ItemID["super_glue"];
  public static list = [] as (Tile & Vector)[];
  public static concate(
    coords: Callback.ItemUseCoordinates,
    item: ItemInstance,
    block: Tile,
    player: int
  ) {
    const list = Glue.list;
    if (Entity.getSneaking(player) === false) {
      Glue.list.push({
        id: block.id,
        data: block.data,
        x: coords.x,
        y: coords.y,
        z: coords.z,
      });
    } else {
      const mesh = new RenderMesh();
      for (const list of Glue.list) {
        ItemModel.getForWithFallback(list.id, list.data).addToMesh(
          mesh,
          list.x,
          list.y,
          list.z
        );
        BlockSource.getDefaultForActor(player).setBlock(
          list.x,
          list.y,
          list.z,
          0,
          0
        );
      }
      const animation = new Animation.Base(
        list[0].x,
        list[0].y,
        list[0].z
      );
      animation.describe({ mesh, skin: "atlas::terrain" });
      animation.load();
    }
  }
  static {
    Item.registerUseFunctionForID(Glue.ITEM, Glue.concate);
  }
}
// Callback.addCallback("ItemUse", (coords, item, block, ie, player) => {
//     if (Entity.getSneaking(player) === false) {
//      Game.message("Добавлено! " + block.id)
//       meshes.push(ItemModel.getItemRenderMeshFor(block.id, 1, 0, false));
//       Game.message(JSON.stringify(meshes))
//     } else {
//       const result = meshes.reduce((pv, cv, ci, a) => {
//         pv.addMesh(cv, ci * 16, ci * 16, 0);
//         return pv;
//       }, new RenderMesh());
//       const animation = new Animation.Base(coords.x + 0.5, coords.y + 1.5, coords.z + 0.5);
//       animation.describe({mesh: result, skin: "atlas::terrain", scale: 1.5});
//       animation.load();
//     }
//   }); //!
