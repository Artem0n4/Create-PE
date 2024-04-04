IMPORT("BlockEngine");
IMPORT("SoundAPI");
IMPORT("StorageInterface");
/**
 *  __ dir __ + "resources/models/"
 */
var models_dir = __dir__ + "resources/models/";
var MathHelper = {
    randomValue: function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var random = values[Math.floor(Math.random() * values.length)];
        return random;
    },
    radian: function (gradus) {
        return gradus * Math.PI / 180;
    }
};
var CItem = /** @class */ (function () {
    function CItem(obj) {
        var _a;
        this.id = ItemID[obj.id];
        var texture = ((_a = obj.texture) !== null && _a !== void 0 ? _a : (obj.texture = obj.id));
        var meta_num = texture[texture.length - 1];
        IDRegistry.genItemID(obj.id);
        Item.createItem(obj.id, obj.name || obj.id, {
            name: texture,
            meta: 0,
        }, {
            stack: obj.stack || 64,
        });
    }
    CItem.prototype.model = function (model, import_params) {
        var mesh = new RenderMesh();
        mesh.importFromFile(models_dir + "item/" + model + ".obj", "obj", import_params || null);
        return mesh;
    };
    CItem.prototype.setHandModel = function (model, texture, import_params) {
        ItemModel.getForWithFallback(this.id, 0).setHandModel(this.model(model, import_params), texture !== null && texture !== void 0 ? texture : model);
    };
    CItem.prototype.setItemModel = function (model, texture, import_params) {
        ItemModel.getForWithFallback(this.id, 0).setModel(this.model(model, import_params), texture !== null && texture !== void 0 ? texture : model);
    };
    CItem.prototype.setInventoryModel = function (model, texture, import_params, rotation) {
        if (rotation === void 0) { rotation = [0, 0, 0]; }
        var mesh = this.model(model, import_params);
        mesh.rotate(MathHelper.radian(rotation[0]), MathHelper.radian(rotation[1]), MathHelper.radian(rotation[2]));
        ItemModel.getForWithFallback(this.id, 0).setUiModel(mesh, texture !== null && texture !== void 0 ? texture : model);
    };
    return CItem;
}());
(function () {
    var texture = FileTools.GetListOfFiles(__dir__ + "resources/assets/items-opaque/generate/", "png");
    for (var i in texture) {
        var id = String(texture[i]).split("/").pop().split(".")[0];
        new CItem({
            id: id,
            name: "item." + id + ".create"
        });
    }
    ;
})();
var WRENCH = new CItem({
    id: "create_wrench"
});
WRENCH.setInventoryModel("wrench", "wrench", {
    translate: [0.5, 0, 0.5], scale: [2, 2, 2], invertV: false, noRebuild: false
}, [0, 0, -30]);
WRENCH.setHandModel("wrench", "wrench", {
    translate: [0.25, 0, 0], scale: [2.5, 2.5, 2.5], invertV: false, noRebuild: false
});
var LiquidFactory = /** @class */ (function () {
    function LiquidFactory(name, texture) {
        this.name = name;
        Game.message("Жидкость прошла инициализацию: " + this.name);
        LiquidFactory.container.push({ name: name, texture: texture, input: [], output: [] });
    }
    LiquidFactory.prototype.registerLiquidItem = function (input, output) {
        output !== null && output !== void 0 ? output : (output = input + "_empty");
        LiquidFactory.container[this.name];
    };
    LiquidFactory.validateLiquid = function (item, data, entity) {
        for (var i in LiquidFactory.container) {
            var liquid = LiquidFactory.container[i];
            if (item.id === liquid.input[i]) {
                var actor = new PlayerActor(entity);
                actor.setInventorySlot(actor.getSelectedSlot(), liquid.output[i], 1, 0, null);
                data[liquid.name[i]]++;
                //Debug
                alert("Liquid item has been replaced");
                return;
            }
        }
    };
    LiquidFactory.container = [];
    return LiquidFactory;
}());
var WATER = new LiquidFactory("water", "water_flow");
var LAVA = new LiquidFactory("lava", "lava_flow");
