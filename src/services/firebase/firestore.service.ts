import firebase from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import config from '../config/config.module';
export type Collection = firebase.firestore.CollectionReference;
export type QueryCollection =
  firebase.firestore.Query<firebase.firestore.DocumentData>;
export const FieldValue = firebase.firestore.FieldValue;
export type Snapshot = firebase.firestore.QuerySnapshot;

@Injectable()
export class FirestoreService {
  private db: firebase.app.App;
  private firestore: firebase.firestore.Firestore;
  public static fieldValue = firebase.firestore.FieldValue;

  constructor() {
    this.db = config.FIREBASE_DB;
    this.firestore = this.db.firestore();
  }

  public createCollection = (path: string) => this.firestore.collection(path);

  public createBatch = () => this.firestore.batch();
}
