import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface InquiryRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'reviewed' | 'archived';
  createdAt?: Timestamp | any;
}

const INQUIRIES_COLLECTION = 'inquiries';

export async function submitInquiry(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;

  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await setDoc(docRef, {
      name: data.name.trim().substring(0, 100),
      email: data.email.trim().toLowerCase().substring(0, 150),
      subject: data.subject.trim().substring(0, 200),
      message: data.message.trim().substring(0, 2000),
      status: 'unread',
      createdAt: serverTimestamp(),
    });
    return inquiryId;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchInquiries(): Promise<InquiryRecord[]> {
  const path = INQUIRIES_COLLECTION;
  try {
    const q = query(collection(db, INQUIRIES_COLLECTION), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as InquiryRecord[];
  } catch (error) {
    return handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateInquiryStatus(
  inquiryId: string,
  status: 'unread' | 'reviewed' | 'archived'
): Promise<void> {
  const path = `${INQUIRIES_COLLECTION}/${inquiryId}`;
  try {
    const docRef = doc(db, INQUIRIES_COLLECTION, inquiryId);
    await updateDoc(docRef, { status });
  } catch (error) {
    return handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
