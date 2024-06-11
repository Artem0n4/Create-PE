interface IRecipeForm {
  input_0: ItemInstance;
  output: ItemInstance;
}

class ProcessFactory<T extends IRecipeForm> {
  public list: Record<string, T> = {};
  public hasInput: (index: string, container: ItemContainer) => boolean;
  constructor(public input_slots: int) {
    if (input_slots === 1) {
      this.hasInput = function (index, container) {
        return ContainerUtils.equalSlotByInstance(
          "input_0",
          this.list[index].input_0,
          container
        );
      };
    } else {
      this.hasInput = function (index, container) {
        for (let k = 0; k < this.input_slots; k++) {
          return ContainerUtils.equalSlotByInstance(
            "input_" + k,
            this.list[k]["input_" + k],
            container
          );
        }
      };
    }
  }
  public registerRecipe(form: T) {
    this.list[form.output.id] = form;
  }
  decrease(index: string, container: ItemContainer) {
    for (let i = 0; i <= this.input_slots; i++) {
      if (this.hasInput(index, container) === false) {
        continue;
      }
      const slot = container.getSlot("input_" + i);
      return container.setSlot(
        "input_" + i,
        slot.id,
        slot.count - 1,
        slot.data,
        slot.extra
      );
    }
  }
  releaseRecipe(
    container: ItemContainer,
    data: { progress: int; progressMax: int; lock: boolean }
  ) {
    const slot = container.getSlot("output");
    if (slot.count === 64) return;
    for (const i in this.list) {
      if (this.hasInput(i, container)) {
        if (data.progress < data.progressMax && data.lock === true) {
          data.progress++;
        }
        if (data.progress === data.progressMax) {
          data.lock = false;
          this.decrease(i, container);
          container.setSlot("output", slot.id, slot.count + 1, slot.data);
        }
        if (data.progress > 0 && data.lock === false) {
          data.progress--;
          if (data.progress === 0) data.lock = true;
        }
      }
    }
    return;
  }
}

// public hasInput(index: string) {
//   if (this.input_slots === 1) {
//     return ContainerUtils.equalSlotByInstance("input_0", this.list[index].input_0, this.container);
//   } else {
//     for (let k = 0; k < this.input_slots; k++) {
//       return ContainerUtils.equalSlotByInstance(
//         "input_" + k,
//         this.list[k]["input_" + k],
//         this.container
//       );
//     }
//   }
// }
