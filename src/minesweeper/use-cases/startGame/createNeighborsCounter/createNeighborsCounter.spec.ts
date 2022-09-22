import { BombModel } from '@minesweeper/domain/models';
import { cells2x2 } from '@minesweeper/utils/mocks';
import { createNeighborsCounter } from './createNeighborsCounter';

describe('create neighbors', () => {
  it('should return correct neighbor counter if board have 1', () => {
    const bombs: BombModel[] = [{ position: [0, 0] }];

    const neighbors = createNeighborsCounter({ cells: cells2x2, bombs });

    const found = neighbors.find(n => n.quantity === 1);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 0 },
      { position: [1, 0], quantity: 1 },
      { position: [0, 1], quantity: 1 },
      { position: [1, 1], quantity: 1 },
    ]);
  });

  it('should return correct neighbors counter if board have 2 bombs', () => {
    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 1] }];

    const neighbors = createNeighborsCounter({ cells: cells2x2, bombs });

    const found = neighbors.find(n => n.quantity === 2);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 1 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 2 },
      { position: [1, 1], quantity: 1 },
    ]);
  });

  it('should return correct neighbors counter if board have 3 bombs', () => {
    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 0] }, { position: [1, 1] }];

    const neighbors = createNeighborsCounter({ cells: cells2x2, bombs });

    const found = neighbors.find(n => n.quantity === 3);

    expect(found).toBeTruthy();

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 2 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 3 },
      { position: [1, 1], quantity: 2 },
    ]);
  });

  it('should return correct neighbors counter if board have 2 bombs (v2)', () => {
    const bombs: BombModel[] = [{ position: [0, 0] }, { position: [1, 0] }, { position: [0, 1] }];

    const neighbors = createNeighborsCounter({ cells: cells2x2, bombs });

    expect(neighbors).toStrictEqual([
      { position: [0, 0], quantity: 2 },
      { position: [1, 0], quantity: 2 },
      { position: [0, 1], quantity: 2 },
      { position: [1, 1], quantity: 3 },
    ]);
  });
});
