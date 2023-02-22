import { ConflictException, NotFoundException } from '@nestjs/common';
import { FirestoreRepository } from '../services/firebase/firestore.repository';

export abstract class CrudService<K extends string | number, V> {
  constructor(
    private entityName: string,
    protected repository: FirestoreRepository<V>,
  ) {}

  async findOne(id: K) {
    return this.repository.get(id);
  }

  async getAll() {
    return this.repository.getArray();
  }

  async findOneOrThrow(id: K, errorText = `${this.entityName} not found`) {
    const result = await this.repository.get(id);
    if (result) return result;
    throw new NotFoundException(errorText);
  }

  async throwIfExists(id: K, errorText = `${this.entityName} not found`) {
    const result = await this.repository.get(id);
    if (!result) throw new ConflictException(errorText);
  }

  async remove(id: K) {
    return this.repository.remove(id);
  }

  async update(id: K, data: Partial<Record<keyof V, any>>) {
    return this.repository.update(id, data);
  }
}
