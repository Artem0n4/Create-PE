const SHAFT = new CBlock("shaft", [{
    name: "block.create.shaft",
    texture: [
        ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],
    ],
    inCreative: true,
},
]).createWithRotation();

SHAFT.setItemModel("item/shaft", "models/item/shaft", {
    translate: [0.5, 0.5, 0.5], scale: [1.1, 1.1, 1.1], invertV: false, noRebuild: false 
}); 


Callback.addCallback("ItemUse", (coords, item, block, itExternal, player) => {
    Game.message(String(block.id + ": " + block.data ));

}) 

class Shaft extends ShaftBase {
    public formingRenderBySides(player) {
        if (Entity.getSneaking(player) === true) {
          this.data.placed = "up";
          return ShaftBase.formingRender(0, 0, 0, 0);
        }
    
  if(this.data.placed !== "up") super.formingRenderBySides(player);
        
      };

    public override onTick(): void {
        if (!this.data.animation) return;
    
        if(this.data.energy > 0)
      return this.rotate(this.data.animation);
      }
    
};

TileEntity.registerPrototype(BlockID["shaft"], new Shaft())
