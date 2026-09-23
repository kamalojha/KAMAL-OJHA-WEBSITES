import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { handleFirestoreError, OperationType } from '../firebase/errors';

export interface EndorsementRecord {
  id: string;
  authorUid: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  authorRole: string;
  organization: string;
  relationship: 'Recruiter' | 'Peer / Colleague' | 'Mentor / Professor' | 'Collaborator' | 'Visitor';
  content: string;
  rating: number;
  createdAt?: Timestamp | any;
}

const COLLECTION_NAME = 'endorsements';

export function subscribeToEndorsements(
  onData: (endorsements: EndorsementRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const path = COLLECTION_NAME;
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as EndorsementRecord[];
      onData(records);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrappedError: any) {
        if (onError) onError(wrappedError);
      }
    }
  );
}

export async function submitEndorsement(data: {
  authorUid: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  authorRole: string;
  organization: string;
  relationship: 'Recruiter' | 'Peer / Colleague' | 'Mentor / Professor' | 'Collaborator' | 'Visitor';
  content: string;
  rating: number;
}): Promise<string> {
  const endorsementId = `end_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const path = `${COLLECTION_NAME}/${endorsementId}`;

  try {
    const docRef = doc(db, COLLECTION_NAME, endorsementId);
    await setDoc(docRef, {
      authorUid: data.authorUid,
      authorName: data.authorName.trim().substring(0, 100),
      authorEmail: data.authorEmail.trim().toLowerCase().substring(0, 150),
      authorRole: data.authorRole.trim().substring(0, 120),
      organization: data.organization.trim().substring(0, 120),
      relationship: data.relationship,
      content: data.content.trim().substring(0, 1000),
      rating: Math.min(5, Math.max(1, Math.round(data.rating))),
      createdAt: serverTimestamp(),
      ...(data.authorPhoto ? { authorPhoto: data.authorPhoto.substring(0, 500) } : {}),
    });
    return endorsementId;
  } catch (error) {
    return handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function removeEndorsement(id: string): Promise<void> {
  const path = `${COLLECTION_NAME}/${id}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    return handleFirestoreError(error, OperationType.DELETE, path);
  }
}
