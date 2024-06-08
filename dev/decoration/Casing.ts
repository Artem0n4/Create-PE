type casing = "andesite" | "brass" | "copper" | "railway"; 
// | "creative" | "refined_radiance" | "shadow_steel"; it is secret
class Casing extends CBlock {
  public static readonly RAILWAY = new Casing("railway");
  public static readonly BRASS = new Casing("brass");
  public static readonly ANDESITE = new Casing("andesite");
  public static readonly COPPER = new Casing("copper");
  constructor(type: casing) {
    type = `${type}_casing` as casing;
    super(type, [
      {
        name: "block.create." + type,
        texture: [
          [type, 0],
          [type, 0],
          [type, 0],
          [type, 0],
          [type, 0],
          [type, 0],
        ],
        inCreative: true,
      },
    ]);
    this.create();
    ConnectedTexture.setModelForGlass(BlockID[type], 0, type);
  }
}
