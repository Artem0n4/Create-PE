abstract class FilterHelper {
  public static constructRender(stack: ItemStack, tile: TileEntity & {filter_model: Animation.Base}) {
    const mesh = new RenderMesh();
    tile.filter_model = new Animation.Base(tile.x, tile.y + 0.5, tile.z)
    //...
  }
};

const Filter = function<T extends { new(...args: any[]): TileEntityBase }>(constructor: T) {
    return new class extends constructor {
      a() {}
      clientLoad() {
        return this.clientLoad();
      }
    }
} as Function