"use strict";
(() => {
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateGet = (obj, member, getter) => {
    __accessCheck(obj, member, "read from private field");
    return getter ? getter.call(obj) : member.get(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateSet = (obj, member, value, setter) => {
    __accessCheck(obj, member, "write to private field");
    setter ? setter.call(obj, value) : member.set(obj, value);
    return value;
  };

  // buscaminas/domain/cell.ts
  var _wasMarkedAsBomb, _wasExposed;
  var Cell = class {
    constructor(x, y, id, isBomb) {
      __privateAdd(this, _wasMarkedAsBomb, void 0);
      __privateAdd(this, _wasExposed, void 0);
      this.expose = () => {
        if (!__privateGet(this, _wasMarkedAsBomb) && !__privateGet(this, _wasExposed) && !this.isBomb) {
          __privateSet(this, _wasExposed, true);
        }
      };
      this.markAsBomb = () => __privateSet(this, _wasMarkedAsBomb, true);
      this.unCheckAsBomb = () => __privateSet(this, _wasMarkedAsBomb, false);
      this.isExposed = () => __privateGet(this, _wasExposed);
      this.isMarkAsBomb = () => __privateGet(this, _wasMarkedAsBomb);
      this.getPosition = () => this.position;
      this.getId = () => this.id;
      this.position = { x, y };
      this.id = id;
      this.isBomb = isBomb;
      __privateSet(this, _wasMarkedAsBomb, false);
      __privateSet(this, _wasExposed, false);
    }
  };
  _wasMarkedAsBomb = new WeakMap();
  _wasExposed = new WeakMap();
  var _cellsAround, _totalBombsAround;
  var CellInBoard = class extends Cell {
    constructor(cell, cellsAround, totalBombsAround) {
      const { x, y } = cell.getPosition();
      super(x, y, cell.getId(), cell.isBomb);
      __privateAdd(this, _cellsAround, void 0);
      __privateAdd(this, _totalBombsAround, void 0);
      this.getIdsOfCellsAround = () => __privateGet(this, _cellsAround);
      this.getTotalBombsAround = () => __privateGet(this, _totalBombsAround);
      __privateSet(this, _cellsAround, cellsAround);
      __privateSet(this, _totalBombsAround, totalBombsAround);
    }
  };
  _cellsAround = new WeakMap();
  _totalBombsAround = new WeakMap();

  // buscaminas/domain/game-board.ts
  var _bombs;
  var GameBoard = class {
    constructor({
      rows,
      columns,
      totalBombs
    }) {
      this.hasLostGame = false;
      this.hasWonGame = false;
      __privateAdd(this, _bombs, void 0);
      this.markCellAsBomb = (cell) => {
        if (this.getRemainingBoms() <= 0)
          return;
        cell.markAsBomb();
        this.decrementRemainingBombs();
        if (this.isWonGame()) {
          this.cells.forEach((cell2) => {
            cell2.expose();
          });
        }
      };
      this.unCheckAsBomb = (cell) => {
        cell == null ? void 0 : cell.unCheckAsBomb();
        if (this.remainingBoms >= this.totalBombs)
          return;
        this.incrementRemainingBombs();
      };
      this.exposeCell = (cell) => {
        const z = [];
        const alo = (id) => {
          var _a;
          const cell2 = this.getCell(id);
          if (!cell2)
            return;
          if (cell2.getTotalBombsAround() === 0 && !cell2.isExposed() && !cell2.isMarkAsBomb()) {
            cell2.expose();
            console.log(cell2.getId());
            z.push(cell2);
            (_a = cell2.getIdsOfCellsAround()) == null ? void 0 : _a.forEach((id2) => {
              alo(id2);
            });
          }
          if (!cell2.isMarkAsBomb() && !cell2.isExposed()) {
            cell2.expose();
            console.log(cell2.getId());
            z.push(cell2);
          }
        };
        alo(cell.getId());
        cell.expose();
        if (cell.isBomb && !cell.isMarkAsBomb()) {
          return this.getCells().filter((cell2) => {
            cell2.isBomb && cell2.expose();
            return cell2.isBomb;
          });
        }
        return z;
      };
      this.setBombs = () => {
        if (this.totalBombs === __privateGet(this, _bombs).filter((bomb) => bomb).length) {
          return;
        }
        const random = getRandomValue(this.rows * this.columns);
        if (!__privateGet(this, _bombs)[random]) {
          __privateGet(this, _bombs)[random] = true;
        }
        return this.setBombs();
      };
      this.getCells = () => this.cells;
      this.getRemainingBoms = () => this.remainingBoms;
      this.getCell = (id) => {
        return this.cells[id];
      };
      this.getCellsAround = (cells, cell) => {
        const { x, y } = cell.getPosition();
        const filterCellsAround = (cell2) => {
          const { x: cellX, y: cellY } = cell2.getPosition();
          return cellX >= x - 1 && cellX <= x + 1 && cellY >= y - 1 && cellY <= y + 1 && (cellX !== x || cellY !== y);
        };
        return cells.filter(filterCellsAround);
      };
      this.getTotalBombsAround = (cells, cell) => {
        const cellsAround = this.getCellsAround(cells, cell);
        return cellsAround.filter((cell2) => cell2.isBomb).length;
      };
      this.decrementRemainingBombs = () => this.remainingBoms--;
      this.incrementRemainingBombs = () => this.remainingBoms++;
      this.isWonGame = () => this.getRemainingBoms() === 0 && this.getCells().every((cell) => cell.isBomb === cell.isMarkAsBomb());
      this.rows = rows;
      this.columns = columns;
      this.totalBombs = totalBombs;
      this.remainingBoms = totalBombs;
      __privateSet(this, _bombs, Array(rows * columns).fill(false));
      this.setBombs();
      let x = -1;
      let y = 0;
      const cells = __privateGet(this, _bombs).map((isBomb, index) => {
        x++;
        if (x >= columns) {
          y++;
          x = 0;
        }
        return new Cell(x, y, index, isBomb);
      });
      this.cells = cells.map((cell) => {
        return new CellInBoard(
          cell,
          this.getCellsAround(cells, cell).map((c) => c.getId()),
          this.getTotalBombsAround(cells, cell)
        );
      });
    }
  };
  _bombs = new WeakMap();
  function getRandomValue(maxValue) {
    return Math.floor(Math.random() * maxValue);
  }

  // buscaminas/application/use-cases.ts
  var createGameBoard = async (repository, { rows, columns, totalBombs }) => {
    return await repository.saveGameBoard({ rows, columns, totalBombs });
  };
  var _handleLose, _handleWin;
  var UseCase = class {
    constructor(table) {
      __privateAdd(this, _handleLose, () => null);
      __privateAdd(this, _handleWin, () => null);
      this.markCellAsBomb = (id) => {
        const cell = this.table.getCell(id);
        if (!cell || this.table.getRemainingBoms() <= 0)
          return;
        this.table.markCellAsBomb(cell);
      };
      this.unCheckAsBomb = (id) => {
        const cell = this.table.getCell(id);
        if (!cell)
          return;
        this.table.unCheckAsBomb(cell);
      };
      this.exposeCell = (id) => {
        const cell = this.table.getCell(id);
        if (!cell)
          return [];
        return this.table.exposeCell(cell);
      };
      this.getCells = () => this.table.getCells();
      this.isCellMarkedHasBomb = (id) => {
        const cell = this.table.getCell(id);
        return (cell == null ? void 0 : cell.isMarkAsBomb()) || false;
      };
      this.onLose = (fn) => {
        __privateSet(this, _handleLose, fn);
      };
      this.onWin = (fn) => {
        __privateSet(this, _handleWin, fn);
      };
      this.table = new GameBoard(table);
    }
  };
  _handleLose = new WeakMap();
  _handleWin = new WeakMap();

  // buscaminas/infrastructure/data/index.ts
  var dataRepository = {
    saveGameBoard: async () => {
      return {
        cells: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 }
        ],
        totalMines: 4,
        remainingMines: 4,
        hasWonGame: false,
        hasLostGame: false
      };
    }
  };

  // buscaminas/infrastructure/ui/index.ts
  var initialData = {
    rows: 5,
    columns: 5,
    totalBombs: 2
  };
  var buscaminas = new UseCase(initialData);
  createGameBoard(dataRepository, initialData).then((r) => console.log(r));
  var $totalBombs = document.getElementById("total-bombs");
  var root = document.getElementById("root");
  var fragment = document.createDocumentFragment();
  if ($totalBombs) {
    $totalBombs.textContent = initialData.totalBombs.toString();
  }
  buscaminas.getCells().forEach((cell) => {
    const button = document.createElement("button");
    button.style.width = "4rem";
    button.style.height = "4rem";
    button.id = cell.getId().toString();
    fragment.appendChild(button);
  });
  var getColumns = (num) => Array.from({ length: num }).map(() => "1fr").join(" ");
  if (root) {
    root.style.width = "min-content";
    root.style.margin = "auto";
    root.style.display = "grid";
    root.style.gridTemplateColumns = getColumns(initialData.columns);
    root.appendChild(fragment);
    root.addEventListener("contextmenu", (e) => e.preventDefault());
    const secondClickListener = (e) => {
      e.preventDefault();
      const button = e.target;
      const ID = Number(button.id);
      const cell = buscaminas.getCells()[ID];
      if (!button.disabled) {
        if (buscaminas.isCellMarkedHasBomb(ID)) {
          button.textContent = "";
          buscaminas.unCheckAsBomb(ID);
        } else if (buscaminas.table.getRemainingBoms() > 0) {
          button.textContent = "\u{1F575}\uFE0F\u200D\u2642\uFE0F";
          buscaminas.markCellAsBomb(ID);
        }
      }
      if ($totalBombs) {
        $totalBombs.textContent = buscaminas.table.getRemainingBoms().toString();
      }
    };
    root.addEventListener("contextmenu", secondClickListener);
    const exposeCellListener = (e) => {
      const { id } = e.target;
      const ID = Number(id);
      const exposedCells = buscaminas.exposeCell(ID);
      console.log({ exposedCells });
      exposedCells.forEach((cell) => {
        var _a;
        const element = document.getElementById(
          cell.getId().toString()
        );
        if (element) {
          if (cell.isBomb) {
            element.style.backgroundColor = "red";
            console.log(cell);
            return;
          }
          const text = cell.getTotalBombsAround() !== 0 && !cell.isBomb ? (_a = cell.getTotalBombsAround()) == null ? void 0 : _a.toString() : "";
          element.textContent = text;
          element.disabled = true;
        }
      });
    };
    root.addEventListener("click", exposeCellListener);
    buscaminas.onLose(() => {
      console.log("perdiste");
      root == null ? void 0 : root.removeEventListener("click", exposeCellListener);
      root == null ? void 0 : root.removeEventListener("contextmenu", secondClickListener);
    });
    buscaminas.onWin(() => {
      console.log("ganaste");
      root == null ? void 0 : root.removeEventListener("click", exposeCellListener);
      root == null ? void 0 : root.removeEventListener("contextmenu", secondClickListener);
      buscaminas.getCells().forEach((cell) => {
        const element = document.getElementById(
          cell.getId().toString()
        );
        if (element) {
          if (cell.isExposed()) {
            console.log("paso");
            element.disabled = true;
          }
        }
      });
    });
  }
  console.timeEnd("hola");
  console.log(buscaminas);
})();
