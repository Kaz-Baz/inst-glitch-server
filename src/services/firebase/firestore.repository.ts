import { Collection, FirestoreService, Snapshot } from './firestore.service';
import { PartialRecord } from './../../interfaces/index';
import firebase, { firestore } from 'firebase-admin';

export abstract class FirestoreRepository<T> {
  protected ref: Collection;
  constructor(
    protected readonly collectionName: string,
    private firestore: FirestoreService,
  ) {
    this.ref = firestore.createCollection(collectionName);
  }

  async asArray(snapshot: Snapshot) {
    return snapshot.docs.map((doc) => doc.data() as T);
  }

  async get(id: string | number): Promise<T | null> {
    const doc = await this.ref.doc(String(id)).get();
    return doc.exists ? (doc.data() as T) : null;
  }

  async getArray(limit?: number): Promise<T[]> {
    const query = limit ? this.ref.limit(limit) : this.ref;
    return this.asArray(await query.get());
  }

  async getObjects(limit?: number): Promise<{ [id: string]: T }> {
    const query = limit ? this.ref.limit(limit) : this.ref;
    return this.asObject(await query.get());
  }

  async getObjectsByIds(ids: string[] | number[]) {
    const docs = await this.ref.where('id', 'in', ids).get();
    return this.asObject(docs);
  }

  async asObject(
    snapshot: firebase.firestore.QuerySnapshot,
  ): Promise<{ [id: string | number]: T } | null> {
    return snapshot.docs.reduce(
      (acc, item) => ({ ...acc, [item.id]: item.data() } as T),
      {},
    );
  }

  async update(
    id: string | number,
    updates: PartialRecord<keyof T, any> | any,
  ) {
    return this.ref.doc(String(id)).set(updates, { merge: true });
  }

  async set(id: string | number, model: T) {
    return this.ref.doc(String(id)).set(model, { merge: true });
  }

  async remove(id: string | number) {
    return this.ref.doc(String(id)).delete();
  }

  toIds(snapshot: firebase.firestore.QuerySnapshot) {
    return snapshot.docs.map((doc) => doc.id);
  }

  async getIds(): Promise<string[]> {
    return this.toIds(await this.ref.get());
  }

  async getArrayByIds(ids: string[] | number[]) {
    return this.getWhere('id', 'in', ids).then(this.asArray);
  }

  async getIdsByIds(ids: string[] | number[]) {
    return this.getWhere('id', 'in', ids).then(this.toIds);
  }

  async first(snapshot: firebase.firestore.QuerySnapshot) {
    return snapshot.empty ? null : (snapshot.docs[0].data() as T);
  }

  isArray(val: any): val is Array<any> {
    return typeof val === 'object' && Array.isArray(val);
  }

  where(
    field: keyof T | firestore.FieldPath | string,
    condition: firestore.WhereFilterOp,
    value: string | number | string[] | number[],
  ) {
    return this.ref.where(
      field as string | firestore.FieldPath,
      condition,
      value,
    );
  }

  async getWhere(
    field: keyof T | firestore.FieldPath | string,
    condition: firestore.WhereFilterOp,
    value: string | number | string[] | number[],
  ) {
    if (this.isArray(value) && !value.length) return [];

    return this.where(field, condition, value).get();
  }

  async getNotFound(ids: number[]) {
    if (ids.length) return [];
    const found = (await this.getIdsByIds(ids)).map((id) => +id);
    return ids.filter((id) => found.indexOf(id) === -1);
  }
}
