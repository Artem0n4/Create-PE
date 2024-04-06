IMPORT("BlockEngine");
IMPORT("SoundAPI");
IMPORT("StorageInterface");

//types
type int = number;
type name = string;
type texture = string;

/**
 *   __ dir __ + "resources/assets/models/";   
 * @block __block__/name — for __block__ model;   
 * @item __item__/name — for __item__ model;   
 */

const models_dir = __dir__ + "resources/assets/models/";

const MathHelper = {
    randomValue: function (...values): any {
      const random = values[Math.floor(Math.random() * values.length)];
      return random;
    },
    radian(gradus: int): int {
      return gradus * Math.PI / 180
    },
  };
  
  const ObjectValues = function(obj: {}) { 
    return Object.keys(obj).map(function(v) { 
    return obj[v] 
    }) 
   } 