abstract class ProcessingTile<T extends IRecipeForm> extends TileEntityBase {
  public static list: int[];
   public static BLOCK: CBlock;
   public static factory: ProcessFactory<T>;
  public defaultValues = {
    power: 0,
    lock: true,
    progress: 0,
    progressMax: 250,
  };
  public static transfer(coords: Vector, region: BlockSource, power: int) {
    const block = region.getBlockId(coords.x, coords.y, coords.z);
    if (ProcessingTile.list.includes(block) === false) return;
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z);
    if (!tile) return;
    tile.data.en = power;
  }
  public onTick() {
    if (this.data.power > 0) {
     return ProcessingTile.factory.releaseRecipe(
        this.data as { progress: number; progressMax: number; lock: boolean }
      );
    }
  };
}
