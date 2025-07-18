import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase/client';

export interface SerializedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: SerializedUser | null;
  role: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: true,
};

export const fetchUserAndRole = createAsyncThunk<void, void>(
  'auth/fetchUserAndRole',
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const serializedUser: SerializedUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          };
          dispatch(setUser(serializedUser));

          try {
            const db = getFirestore();
            const roleSnap = await getDoc(doc(db, 'userRoles', firebaseUser.uid));
            const role = roleSnap.exists() ? roleSnap.data().role : 'user';
            dispatch(setRole(role));
          } catch (error) {
            console.error('Error fetching user role:', error);
            dispatch(setRole('user'));
          }
        } else {
          dispatch(clearUser());
        }
        resolve();
      });
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SerializedUser | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
      state.role = null;
      state.loading = false;
    },
    setRole: (state, action: PayloadAction<string | null>) => {
      state.role = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setRole, setLoading } = authSlice.actions;
export default authSlice.reducer;
