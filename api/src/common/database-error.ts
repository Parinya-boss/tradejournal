import { ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

export function handleDatabaseError(
  error: unknown,
  duplicateMessage: string,
  relationMessage: string,
): never {
  if (error instanceof QueryFailedError) {
    const code = (error.driverError as { code?: string }).code;

    if (code === 'ER_DUP_ENTRY') {
      throw new ConflictException(duplicateMessage);
    }

    if (
      code === 'ER_ROW_IS_REFERENCED_2' ||
      code === 'ER_NO_REFERENCED_ROW_2'
    ) {
      throw new ConflictException(relationMessage);
    }
  }
  throw error;
}
