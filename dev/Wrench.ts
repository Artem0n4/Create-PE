class Wrench extends CItem {

};

const WRENCH = new CItem({
    id: "create_wrench", texture: "create_wrench", stack: 1
});

WRENCH.setInventoryModel("item/wrench", "item/create_wrench", {
    translate: [0.25, 0, 0.5], scale: [1.50, 1.50, 1.50], invertV: false, noRebuild: false 
}, [0, 0, -45]);

WRENCH.setHandModel("item/wrench", "item/create_wrench", {
    translate: [0.25, 0, 0],scale: [2.5, 2.5, 2.5], invertV: false, noRebuild: false 
})