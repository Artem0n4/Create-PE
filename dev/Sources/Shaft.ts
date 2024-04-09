const SHAFT = new CBlock("shaft", [{
    name: "block.create.shaft",
    texture: [
        ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],    ["unknown", 0],
    ],
    inCreative: true,
},
]).createWithRotation();

SHAFT.setItemModel("item/shaft", "item/shaft", {
    translate: [0.5, 0.5, 0.5], scale: [1.1, 1.1, 1.1], invertV: false, noRebuild: false 
}); 


Callback.addCallback("ItemUse", (coords, item, block, itExternal, player) => {
    Game.message(String(block.id + ": " + block.data ));

}) 

class Shaft extends ShaftBase {
public consumeEnergyBySides(): void {
    super.consumeEnergyBySides();
    Game.message("energy: " + this.data.energy)
    this.restart(this.x, this.y, this.z)
    this.restartAnimationByShaft(this.x, this.y, this.z)
}
    public override onTick(): void {
        if (!this.data.animation) return;
    //
        //this.consumeEnergyBySides();
        if(this.data.energy > 0)
      return this.rotate(this.data.animation);
   //   }
    
};
};

TileEntity.registerPrototype(ECreateTrinket.SHAFT, new Shaft());

(() => {
    const first = new ICRender.CollisionShape();
    first.addEntry().addBox(0.375, 0.5, 0, 0.625, 0.75, 1);

    const second = new ICRender.CollisionShape();
    second.addEntry().addBox(0, 0.5, 0.375, 1, 0.75, 0.625);
    BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 0, first);
    BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 1, first); //1, 2 = 90 graduses

    BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 2, second);
    BlockRenderer.setCustomCollisionAndRaycastShape(ECreateTrinket.SHAFT, 3, second)
})()