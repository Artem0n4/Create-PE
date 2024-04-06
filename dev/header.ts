IMPORT("BlockEngine");
IMPORT("SoundAPI");
IMPORT("StorageInterface");

//types
type int = number;
type name = string;
type texture = string;

/**
 *  __ dir __ + "resources/assets/models/"
 */
const models_dir = __dir__ + "resources/assets/models/";

const MathHelper = {
    randomValue: function (...values): any {
      const random = values[Math.floor(Math.random() * values.length)];
      return random;
    },
    radian(gradus: int): int {
      return gradus * Math.PI / 180
    }
  };
  
  enum EShaftRotation {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
  FOURTH = 3
  }