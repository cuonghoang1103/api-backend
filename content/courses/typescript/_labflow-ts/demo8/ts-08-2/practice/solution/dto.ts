type Note = { id: number; title: string; body: string; ownerId: number; createdAt: string };

// Omit the server-owned fields — the DTO tracks Note.
export type CreateNote = Omit<Note, 'id' | 'createdAt'>;

const input: CreateNote = { title: 'Hi', body: 'x', ownerId: 1 };
console.log(input);
