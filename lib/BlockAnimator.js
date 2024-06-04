LIBRARY({
    name: "BlockAnimator",
    version: 1,
    shared: true,
    api: "CoreEngine",
});
var LIB = { name: "BlockAnimator", version: 1 };
alert("".concat(LIB.name, " of version ").concat(LIB.version, " has been initialized!"));
var ObjectValues = function (obj) {
    return Object.keys(obj).map(function (v) { return obj[v]; });
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var BlockAnimator = /** @class */ (function () {
    function BlockAnimator(coords, tile) {
        this.coords = coords;
        this.tile = tile;
        this.animation = new Animation.Base(coords.x, coords.y, coords.z);
    }
    BlockAnimator.prototype.load = function () {
        this.animation.load();
    };
    BlockAnimator.prototype.describe = function (mesh, texture, scale, material) {
        if (scale === void 0) { scale = 1; }
        this.animation.describe(__assign({ mesh: mesh instanceof RenderSide ? mesh.getRenderMesh(this.tile) : mesh, skin: texture, scale: scale }, (material && { material: material })));
        this.animation.setBlocklightMode();
    };
    BlockAnimator.prototype.rotate = function (x, y, z) {
        !this.animation && this.animation.load();
        this.animation.transform().rotate(x, y, z);
    };
    BlockAnimator.prototype.scale = function (x, y, z) {
        !this.animation && this.animation.load();
        this.animation.transform().scale(x, y, z);
    };
    BlockAnimator.prototype.move = function (x, y, z, sign) {
        var coords = this.coords;
        if (sign === "-") {
            this.coords = { x: coords.x - x, y: coords.y - y, z: coords.z - z };
        }
        else {
            this.coords = { x: coords.x + x, y: coords.y + y, z: coords.z + z };
        }
        this.animation.setPos(this.coords.x, this.coords.y, this.coords.z);
    };
    BlockAnimator.prototype.destroy = function () {
        this.animation && this.animation.destroy();
    };
    BlockAnimator.generateMesh = function (model, params, rotate) {
        if (params === void 0) { params = {
            translate: [0.5, 0.5, 0.5],
            invertV: false,
            noRebuild: false,
        }; }
        var mesh = new RenderMesh(__dir__ + "/resources/assets/models/" + model + ".obj", "obj", params);
        if (rotate) {
            mesh.rotate(rotate[0], rotate[1], rotate[2]);
        }
        return mesh;
    };
    return BlockAnimator;
}());
var RenderSide = /** @class */ (function () {
    function RenderSide(model, importParams) {
        if (importParams === void 0) { importParams = null; }
        this.model = model;
        this.importParams = importParams;
        this.list = [
            BlockAnimator.generateMesh(this.model, this.importParams, [0, 0, 0]),
            BlockAnimator.generateMesh(this.model, this.importParams, [0, Math.PI / 2, 0]),
            BlockAnimator.generateMesh(this.model, this.importParams, [0, -Math.PI, 0]),
            BlockAnimator.generateMesh(this.model, this.importParams, [0, -Math.PI / 2, 0]),
        ];
    }
    ;
    RenderSide.prototype.getRenderMesh = function (tile) {
        var data = tile.blockSource.getBlockData(tile.x, tile.y, tile.z);
        Game.message(Native.Color.GREEN + "Data: " + data);
        return this.list[data];
    };
    return RenderSide;
}());
EXPORT("BlockAnimator", BlockAnimator);
EXPORT("RenderSide", RenderSide);
