var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a setter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot write private member to an object whose class did not declare it"
      );
    return (
      kind === "a"
        ? f.call(receiver, value)
        : f
        ? (f.value = value)
        : state.set(receiver, value),
      value
    );
  };
var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, state, kind, f) {
    if (kind === "a" && !f)
      throw new TypeError("Private accessor was defined without a getter");
    if (
      typeof state === "function"
        ? receiver !== state || !f
        : !state.has(receiver)
    )
      throw new TypeError(
        "Cannot read private member from an object whose class did not declare it"
      );
    return kind === "m"
      ? f
      : kind === "a"
      ? f.call(receiver)
      : f
      ? f.value
      : state.get(receiver);
  };
var _Cell_wasMarkedAsBomb,
  _Cell_wasExposed,
  _CellInBoard_cellsAround,
  _CellInBoard_totalBombsAround;
/*
lógica de negocio:

- si se expone una bomba, todas las bombas del tablero deben ser expuestas y se pierde el juego
- las celdas marcadas como posible bomba no pueden ser expuestas
- las celdas marcadas como bomba no pueden ser mayor a la cantidad de bombas totales

- si la celda no está expuesta no puede mostrar su contenido

*/
export class Cell {
  constructor(x, y, id, isBomb) {
    _Cell_wasMarkedAsBomb.set(this, void 0);
    _Cell_wasExposed.set(this, void 0);
    // las celdas marcadas como posible bomba no pueden ser expuestas
    this.expose = () => {
      if (
        !__classPrivateFieldGet(this, _Cell_wasMarkedAsBomb, "f") &&
        !__classPrivateFieldGet(this, _Cell_wasExposed, "f") &&
        !this.isBomb
      ) {
        __classPrivateFieldSet(this, _Cell_wasExposed, true, "f");
      }
    };
    this.markAsBomb = () =>
      __classPrivateFieldSet(this, _Cell_wasMarkedAsBomb, true, "f");
    this.unCheckAsBomb = () =>
      __classPrivateFieldSet(this, _Cell_wasMarkedAsBomb, false, "f");
    this.isExposed = () => __classPrivateFieldGet(this, _Cell_wasExposed, "f");
    this.isMarkAsBomb = () =>
      __classPrivateFieldGet(this, _Cell_wasMarkedAsBomb, "f");
    this.getPosition = () => this.position;
    this.getId = () => this.id;
    this.position = { x, y };
    this.id = id;
    this.isBomb = isBomb;
    __classPrivateFieldSet(this, _Cell_wasMarkedAsBomb, false, "f");
    __classPrivateFieldSet(this, _Cell_wasExposed, false, "f");
  }
}
(_Cell_wasMarkedAsBomb = new WeakMap()), (_Cell_wasExposed = new WeakMap());
export class CellInBoard extends Cell {
  constructor(cell, cellsAround, totalBombsAround) {
    const { x, y } = cell.getPosition();
    super(x, y, cell.getId(), cell.isBomb);
    _CellInBoard_cellsAround.set(this, void 0);
    _CellInBoard_totalBombsAround.set(this, void 0);
    this.getIdsOfCellsAround = () =>
      __classPrivateFieldGet(this, _CellInBoard_cellsAround, "f");
    this.getTotalBombsAround = () =>
      __classPrivateFieldGet(this, _CellInBoard_totalBombsAround, "f");
    __classPrivateFieldSet(this, _CellInBoard_cellsAround, cellsAround, "f");
    __classPrivateFieldSet(
      this,
      _CellInBoard_totalBombsAround,
      totalBombsAround,
      "f"
    );
  }
}
(_CellInBoard_cellsAround = new WeakMap()),
  (_CellInBoard_totalBombsAround = new WeakMap());
