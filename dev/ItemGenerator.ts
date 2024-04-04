(() => {
    const texture = FileTools.GetListOfFiles(__dir__ + "resources/assets/items-opaque/generate/", "png");
    for(const i in texture) {
        const id = String(texture[i]).split("/").pop().split(".")[0];
      new CItem({
        id,
      });
    };
  })();
  