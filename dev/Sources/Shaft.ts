const SHAFT = new CBlock("shaft", [{
    name: "block.create.shaft",
    texture: [
        ["unknown", 0],
    ],
    inCreative: true,
},
]).createWithRotation();

SHAFT.setItemModel("item/shaft", "models/item/shaft", {
    translate: [0.5, 0.5, 0.5], scale: [1.1, 1.1, 1.1], invertV: false, noRebuild: false 
}); 


Callback.addCallback("ItemUse", (coords, item, block, itExternal, player) => {
    Game.message(""+BlockSource.getDefaultForActor(player).getBlockData(coords.x, coords.y, coords.z));
    Game.message(""+block.data)
}) 

class Shaft extends ShaftBase {


    
};

TileEntity.registerPrototype(BlockID["shaft"], new Shaft())
