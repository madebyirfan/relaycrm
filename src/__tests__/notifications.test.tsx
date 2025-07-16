// ✅ Make sure this file is named: notifications.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../store';
import NotificationsPage from '../pages/NotificationsPage';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Notification } from '../types/Notification';

const mockNotifications: Notification[] = [
  { id: '1', title: 'Test 1', body: 'Body 1' },
  { id: '2', title: 'Test 2', body: 'Body 2' },
];

const server = setupServer(
  rest.get(
    'https://firestore.googleapis.com/v1/projects/YOUR_PROJECT_ID/databases/(default)/documents/notifications',
    (req, res, ctx) => {
      return res(
        ctx.json({
          documents: mockNotifications.map((n) => ({
            name: `projects/YOUR_PROJECT_ID/databases/(default)/documents/notifications/${n.id}`,
            fields: {
              title: { stringValue: n.title },
              body: { stringValue: n.body },
            },
          })),
        })
      );
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('renders notifications from Firebase', async () => {
  render(
    <Provider store={store}>
      <NotificationsPage />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test 1')).toBeInTheDocument();
    expect(screen.getByText('Test 2')).toBeInTheDocument();
  });
});
