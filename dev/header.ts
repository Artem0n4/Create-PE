IMPORT("BlockEngine");
IMPORT("SoundAPI");
IMPORT("StorageInterface");
IMPORT("BlockAnimator");
IMPORT("ConnectedTexture")
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
    return (gradus * Math.PI) / 180;
  },
};

/**
 * @deprecated
 */
const ObjectValues = function (obj: {}) {
  return Object.keys(obj).map(function (v) {
    return obj[v];
  });
};

enum ECreateTrinket {
  SHAFT = BlockID["shaft"],
  HAND_CRANK = BlockID["hand_crank"],
}

enum ETrinketRotation {
  X = Math.PI / 2,
  /**
   * must use also using X
   */
  XY = Math.PI / 2,
  Z = 0,
}

enum ETrinketSide {
  FIRST = 0,
  SECOND = 1,
  THIRD = 2,
  FOURTH = 3,
}

type coords_xyz = {
  x: int,
  y: int,
  z: int
};

type rotation = coords_xyz;

enum EDestroyLevel {
  HAND = 0,
  WOOD = 1,
  STONE = 2,
  IRON = 3,
  DIAMOND = 4
};

// const setupBlockShapeByData = (
//   id: int,
//   data: int,
//   x1: int,
//   y1: int,
//   z1: int,
//   x2: int,
//   y2: int,
//   z2: int
// ) => {
//   const render = new BlockRenderer.Model();
//   const shape = new ICRender.CollisionShape();

//   render.addBox(x1, y1, z1, x2, y2, z2, id, data);
//   shape.addEntry().addBox(x1, y1, z1, x2, y2, z2)

//   const model = new ICRender.Model(render);
//   BlockRenderer.setCustomCollisionShape(id, data, shape);
//   return BlockRenderer.setStaticICRender(id, data, model);
// };

Callback.addCallback("ItemUse", (coords, item, block, isExternal, player) => {
  Game.message(Native.Color.GREEN + IDRegistry.getNameByID(block.id) + " DATA: " + block.data)
});