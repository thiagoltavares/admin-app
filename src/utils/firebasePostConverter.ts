import IPost from "../interfaces/IPost";

export const PostConverter = {
  toFirestore(post: IPost): firebase.firestore.DocumentData {
    return { title: post.title, body: post.body };
  },
  fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot, options: firebase.firestore.SnapshotOptions): IPost {
    const data = snapshot.data(options)!;
    const { id } = snapshot

    return { title: data.title, body: data.body, id };
  }
};

