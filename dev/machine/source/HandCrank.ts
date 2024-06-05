const HAND_CRANK = new CBlock("hand_crank", [
  {
    name: "block.create.hand_crank",
    texture: [
      ["unknown", 0],
      ["unknown", 0],
      ["unknown", 0],
      ["unknown", 0],
      ["unknown", 0],
      ["unknown", 0],
    ],
    inCreative: true,
  },
]).createWithRotation();

class HandCrank extends TileEntityBase {

}

HAND_CRANK.setItemModel("item/hand_crank", "item/hand_crank", {
  translate: [0.5, 0.25, 0.5],
  scale: [1.1, 1.1, 1.1],
  invertV: false,
  noRebuild: false,
});

TileEntity.registerPrototype(
  ECreateTrinket.HAND_CRANK,
  new HandCrank()
);
