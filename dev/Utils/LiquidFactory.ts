class LiquidFactory {
  public static container = [];
  constructor(protected name: name, texture: texture) {
    Game.message("Жидкость прошла инициализацию: " + this.name);
    LiquidFactory.container.push({ name, texture, input: [], output: [] });
  }
  public registerLiquidItem(input, output?) {
    output ??= input + "_empty";
    LiquidFactory.container[this.name];
  }
  public static validateLiquid(item: ItemStack, data, entity: int) {
    for (const i in LiquidFactory.container) {
      const liquid = LiquidFactory.container[i];
      if (item.id === liquid.input[i]) {
        const actor = new PlayerActor(entity);
        actor.setInventorySlot(
          actor.getSelectedSlot(),
          liquid.output[i],
          1,
          0,
          null
        );
        data[liquid.name[i]]++;
        //Debug
        alert("Liquid item has been replaced");

        return;
      }
    }
  }
}

const WATER = new LiquidFactory("water", "water_flow");
const LAVA = new LiquidFactory("lava", "lava_flow");
