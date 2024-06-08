Callback.addCallback("LevelDisplayed", () => {
    Block.setDestroyLevelForID(Shaft.BLOCK.getID(), MiningLevel.STONE);
    Block.setDestroyLevelForID(Basin.BLOCK.getID(), MiningLevel.STONE);
  });
  