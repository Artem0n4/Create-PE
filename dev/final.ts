Callback.addCallback("LevelDisplayed", () => {
    Block.setDestroyLevelForID(Shaft.BLOCK.getID(), MiningLevel.STONE);
    Block.setDestroyLevelForID(Basin.BLOCK.getID(), MiningLevel.STONE);
    Game.message(JSON.stringify(Connection.connecting_list))
  });
  