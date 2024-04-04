IMPORT("BlockEngine");
IMPORT("SoundAPI");
IMPORT("StorageInterface");

//types
type int = number;
type name = string;
type texture = string;

/**
 *  __ dir __ + "resources/models/"
 */
const models_dir = __dir__ + "resources/models/";

const MathHelper = {
    randomValue: function (...values): any {
      const random = values[Math.floor(Math.random() * values.length)];
      return random;
    },
    radian(gradus: int): int {
      return gradus * Math.PI / 180
    }
  };
  