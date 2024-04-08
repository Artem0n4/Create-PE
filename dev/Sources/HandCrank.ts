const HAND_CRANK = new CBlock("hand_crank", [{
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

class HandCrank extends EnergySource {
 public name = "hand_crank";
 public init(): void {

 }
 public onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
     return false;
 }
};

new HandCrank({
    energy_max: 8,
    provide_max: 8
});