interface IMixerForm extends IRecipeForm {
    input_1: int
};

class Mixer extends ProcessingTile {
    public static factory = new ProcessFactory<IMixerForm>(2);
 onTick(): void {
     if(this.data.power > 0) {

     };
     if(World.getThreadTime() % 40 === 0) {
        this.data.power = 0;
     }
 }
}