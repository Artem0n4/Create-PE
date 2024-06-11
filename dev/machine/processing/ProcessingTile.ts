type ProcessTileData = {power: int, lock: boolean, progress: int, progressMax: int};
abstract class ProcessingTile extends TileEntityBase {
  constructor(min: int = 50, max: int = 250) {
    super();
    Connection.registerTo(this.blockID, min, max);
  }
  public animation: BlockAnimator;
  public static list: int[];
   public static BLOCK: CBlock;
   public static factory: ProcessFactory<IRecipeForm>;
  public defaultValues = {
    power: 0,
    lock: true,
    progress: 0,
    progressMax: 250,
  };
  data: ProcessTileData;
  public static transfer(coords: Vector, power: int) {
    const tile = TileEntity.getTileEntity(coords.x, coords.y, coords.z);
    if (!tile) return;
    tile.data.power = power;
  }
 abstract onTick(): void;
}
