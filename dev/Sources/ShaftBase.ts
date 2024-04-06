abstract class ShaftBase extends TileEntityBase {
    public defaultValues = {
        rotation: EShaftRotation,
        HF: 0
    };
    public setupModelByRotation() {
      
    };

    public rotate(animation: Animation.Base, x, y, z) {
        animation.load();
        animation.transform().rotate(x, y, z)
    }
}