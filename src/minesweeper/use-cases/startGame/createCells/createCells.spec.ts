import { Cell } from '@minesweeper/domain/models';
import { createCells } from './createCells';

describe('create cells in board', () => {
  it('should create 1 cell', () => {
    const props = { rows: 1, columns: 1 };

    const cells = createCells(props);

    expect(cells[0].position).toBeTruthy();

    const [x, y] = cells[0].position;

    expect(x).toBeGreaterThanOrEqual(0);
    expect(x).toBeLessThan(props.rows);

    expect(y).toBeGreaterThanOrEqual(0);
    expect(y).toBeLessThan(props.columns);
  });

  it('should return correct cells', () => {
    const props = { rows: 3, columns: 2 };

    const cells = createCells(props);

    expect(cells).toStrictEqual([
      new Cell([0, 0]),
      new Cell([1, 0]),
      new Cell([0, 1]),
      new Cell([1, 1]),
      new Cell([0, 2]),
      new Cell([1, 2]),
    ]);
  });
});
