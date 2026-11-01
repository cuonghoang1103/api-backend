// The application code: it imports the type, so the rename reached it automatically.
import { insertPost } from './db.ts';

insertPost({ title: 'Review my booking API', type: 'CODE_REVIEW' });
