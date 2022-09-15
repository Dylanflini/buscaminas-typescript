import { BombModel } from '@minesweeper/domain/Bomb.model';
import { CellModel } from '@minesweeper/domain/Cell.model';
import { createNeighborsCounter } from './createNeighborsCounter';

describe('create neighbors', () => {
  it('should return 1 bomb', () => {
    const cells: CellModel[] = [
      { position: [0, 0], exposed: false },
      { position: [1, 0], exposed: false },
      { position: [0, 1], exposed: false },
      { position: [1, 1], exposed: false },
    ];

    const bombs: BombModel[] = [{ position: [0, 0] }];

    const neighbors = createNeighborsCounter({ cells, bombs });

    const found = neighbors.find(n => n.quantity === 1);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 0 },
      { position: [1, 0], quantity: 1 },
      { position: [0, 1], quantity: 1 },
      { position: [1, 1], quantity: 1 },
    ]);
  });

  it('should return 2 bombs', () => {
    const cells: CellModel[] = [
      { position: [0, 0], exposed: false },
      { position: [1, 0], exposed: false },
      { position: [0, 1], exposed: false },
      { position: [1, 1], exposed: false },
    ];

    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 1] }];

    const neighbors = createNeighborsCounter({ cells, bombs });

    const found = neighbors.find(n => n.quantity === 2);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 1 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 2 },
      { position: [1, 1], quantity: 1 },
    ]);
  });

  it('should return 3 bombs', () => {
    const cells: CellModel[] = [
      { position: [0, 0], exposed: false },
      { position: [1, 0], exposed: false },
      { position: [0, 1], exposed: false },
      { position: [1, 1], exposed: false },
    ];

    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 0] }, { position: [1, 1] }];

    const neighbors = createNeighborsCounter({ cells, bombs });

    const found = neighbors.find(n => n.quantity === 3);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 2 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 3 },
      { position: [1, 1], quantity: 2 },
    ]);
  });

  it('should return correct bombs', () => {
    const cells: CellModel[] = [
      { position: [0, 0], exposed: false },
      { position: [1, 0], exposed: false },
      { position: [0, 1], exposed: false },
      { position: [1, 1], exposed: false },
    ];

    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 0] }, { position: [0, 1] }];

    const neighbors = createNeighborsCounter({ cells, bombs });

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 2 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 2 },
      { position: [1, 1], quantity: 3 },
    ]);
  });

  it.todo('should all neighbors have value between 0 to 8');
});
