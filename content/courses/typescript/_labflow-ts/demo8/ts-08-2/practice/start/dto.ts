type Note = { id: number; title: string; body: string; ownerId: number; createdAt: string };

// CreateNote is the whole Note, so the caller must send server-owned id and createdAt too.
export type CreateNote = Note;

const input: CreateNote = { title: 'Hi', body: 'x', ownerId: 1 }; // id, createdAt missing
console.log(input);
