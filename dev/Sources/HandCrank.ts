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

class HandCrank extends EnergySource {
  public name = "hand_crank";
public defaultValues = {
    state: 'plus',
    
    timer: 0,
    energy: 0
}
  public init(): void {
    const animation = (this["animation"] = new BlockAnimation(
      {
        model: "hand_crank/hand_crank",
        importParams: {
          noRebuild: false,
          invertV: false,
        },
      },
      {
        texture: "hand_crank/hand_crank",
        pivot_point: { x: this.x + 0.5, y: this.y + 0.5, z: this.z + 0.5 },
        light_pos: { x: this.x, y: this.y, z: this.z },
      }
    ) as BlockAnimation);

    animation.createAnimationWithSides(this.blockSource, this);
    this.data.animation = animation;
    animation.initialize();
  }
  public onItemUse(
    coords: Callback.ItemUseCoordinates,
    item: ItemStack,
    player: number
  ): any {
    const animation = this["animation"] as BlockAnimation;
    this.data.timer = 1;
    if (Entity.getSneaking(player) === true) {
        this.data.state = "minus";
    }
 this.data.state = "plus"
  }
  public destroy(): boolean {
    const animation = this["animation"] as BlockAnimation;
    animation.destroy();
    return false;
  };

  public onTick(): void {
      if(this.data.timer > 0) {
        this.data.energy++;
        const animation = this["animation"] as BlockAnimation;
        this.data.timer < 20 ? this.data.timer++ : this.data.timer = 0;
        const xyz = this.data.state === "minus" ? 0.01 * -1 : 0.01 
         animation.rotateBySumm(xyz, xyz, xyz);
      }
  }
}

HAND_CRANK.setItemModel("item/hand_crank", "item/hand_crank", {
  translate: [0.5, 0.25, 0.5],
  scale: [1.1, 1.1, 1.1],
  invertV: false,
  noRebuild: false,
});

TileEntity.registerPrototype(
  ECreateTrinket.HAND_CRANK,
  new HandCrank({
    energy_max: 8,
    provide_max: 8,
  })
);
