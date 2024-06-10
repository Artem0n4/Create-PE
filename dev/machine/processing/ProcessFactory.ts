interface IRecipeForm {
  input_0: ItemInstance;
  output: ItemInstance;
}

class ProcessFactory<T extends IRecipeForm> {
  public list: Record<string, T> = {};
  constructor(public input_slots: int, public container: ItemContainer) {}
  public registerShapedRecipe(form: T) {
    this.list[form.output.id] = form;
  }
  public compareSlotByInstance(slot: string, stack: ItemInstance) {
    const _slot = this.container.getSlot(slot);
    return (
      _slot.id === stack.id &&
      _slot.count === stack.count &&
      _slot.data === stack.data &&
      _slot.extra === (stack.extra || null)
    );
  }
  public hasInput(index: string) {
    if (this.input_slots === 1) {
      return this.compareSlotByInstance("input_0", this.list[index].input_0);
    } else {
      for (let k = 0; k < this.input_slots; k++) {
        return this.compareSlotByInstance(
          "input_" + k,
          this.list[k]["input_" + k]
        );
      }
    }
  }
  decrease(index: string) {
    for (let i = 0; i <= this.input_slots; i++) {
      if (this.hasInput(index) === false) {
        continue;
      }
      const slot = this.container.getSlot("input_" + i);
      this.container.setSlot(
        "input_" + i,
        slot.id,
        slot.count - 1,
        slot.data,
        slot.extra
      );
    }
  }
  releaseRecipe(data: { progress: int; progressMax: int; lock: boolean }) {
    const slot = this.container.getSlot("output");
    if (slot.count === 64) return;
    for (const i in this.list) {
      const list = this.list[i];
      if (this.hasInput(i)) {
        if (data.progress < data.progressMax && data.lock === true) {
          data.progress++;
        }
        if (data.progress === data.progressMax) {
          data.lock = false;
          this.decrease(i);
          this.container.setSlot("output", slot.id, slot.count + 1, slot.data);
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
