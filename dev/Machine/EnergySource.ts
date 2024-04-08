interface IEnergySourceDescriptor {
  provide_max: int,
  energy_max:  int;
}

class EnergySource extends BlockAnimation {
  public static source_list = {};
  public name: string;
  constructor(descriptor: IEnergySourceDescriptor) {
    super();
    this.defaultValues = {
      energy: 0,
      energy_max: descriptor.energy_max,
      provide_max: descriptor.provide_max,
    };

    EnergySource.source_list[this.name] = {
      descriptor,
    };
  }
  public validationEnergyToProvide(): int {
    if (this.data.energy < this.data.provide_max) {
      return Math.abs(this.data.provide_max - this.data.energy);
    }
    return this.data.provide_max;
  };
  public addEnergy(amount) {
    if(this.data.energy < this.data.energy_max) {
      this.data.energy++ //? 
    }
  };
  public releaseEnergy(x, y, z) {
    const tile = TileEntity.getTileEntity(x, y, z);
    const validate = this.validationEnergyToProvide();
    if (tile && this.data.energy > 0) {
      tile.data.energy += validate;
      this.data.energy -= validate;
    }
  }
}
