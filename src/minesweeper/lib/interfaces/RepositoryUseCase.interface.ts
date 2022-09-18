import { IDataRepository } from '@minesweeper/domain/data.repository';

/**
 * Whenever an use case needs to connect to the data repository
 * this interface provides an standard way to do it.
 *
 * This is required in each case for ensuring standardization
 */
export interface IRepositoryUseCase {
  dataRepository: IDataRepository;
}
