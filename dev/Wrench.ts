const WRENCH = new CItem({
    id: "create_wrench"
});
WRENCH.setInventoryModel("wrench", "create_wrench", {
    translate: [0.5, 0, 0.5], scale: [1.75, 1.75, 1.75], invertV: false, noRebuild: false 
}, [0, 0, -30]);

WRENCH.setHandModel("wrench", "create_wrench", {
    translate: [0.25, 0, 0],scale: [2.5, 2.5, 2.5], invertV: false, noRebuild: false 
})