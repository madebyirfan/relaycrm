// src/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('https://firestore.googleapis.com/v1/projects/**/documents/notifications', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        documents: [
          {
            name: 'projects/demo/databases/(default)/documents/notifications/1',
            fields: {
              title: { stringValue: 'Welcome!' },
              body: { stringValue: 'Thanks for joining.' },
            },
          },
        ],
      })
    );
  }),
];
