import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodError, ZodObject } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodObject<any>) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    // Only validate the body parameter and not others like 'user'
    if (metadata.type === 'body') {
      try {
        this.schema.parse(value);
      } catch (error) {
        if (error instanceof ZodError) {
          throw new BadRequestException({
            message: 'Bad request',
            errors: error.errors.map((error) => ({
              field: error.path.join('.'),
              message: error.message,
            })),
          });
        }

        if (error instanceof Error) {
          throw new BadRequestException({
            message: 'Bad request',
            errors: error.message,
          });
        }

        throw new BadRequestException({
          message: 'Bad request',
          errors: error,
        });
      }
    }

    return value;
  }
}
