import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebase/client';

export interface AuthState {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  role: null,
  loading: true,
};

// ✅ Thunk: Auth state listener + Firestore role fetch
export const fetchUserAndRole = createAsyncThunk<void, void>(
  'auth/fetchUserAndRole',
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          dispatch(setUser(firebaseUser));
          try {
            const db = getFirestore();
            const roleSnap = await getDoc(doc(db, 'userRoles', firebaseUser.uid));
            const role = roleSnap.exists() ? roleSnap.data().role : 'user';
            dispatch(setRole(role));
          } catch (error) {
            console.error('Error fetching user role:', error);
            dispatch(setRole('user')); // fallback
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
    setUser: (state, action: PayloadAction<User | null>) => {
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
