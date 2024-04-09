class KineticBase extends TileEntityBase {
    public defaultValues: {
        energy: number,
        energy_max: number
    };

    public getEnergySource(x, y, z) {
        for(const i in EnergySource.source_list) {
        return this.blockSource.getBlockId(x, y, z) === BlockID[i]
        }
    };
    
    public consumeEnergy(x: int, y: int, z: int) {
        if(this.getEnergySource(x, y, z) === false) return null;
   const tile = TileEntity.getTileEntity(x, y, z);
   if(tile && tile.data.energy) {
    return tile.releaseEnergy(x, y, z),
    Game.message("this: " + this.data.energy + "\nshaft: " + tile.data.energy);
    
   }
    }

    public consumeEnergyBySides() {
      this.consumeEnergy(this.x + 1, this.y, this.z);
      this.consumeEnergy(this.x - 1, this.y, this.z);

      this.consumeEnergy(this.x, this.y, this.z + 1);
      this.consumeEnergy(this.x , this.y, this.z - 1);

      this.consumeEnergy(this.x, this.y + 1, this.z);
      this.consumeEnergy(this.x , this.y - 1, this.z);
    };

 

}