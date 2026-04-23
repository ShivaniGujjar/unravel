import { createSlice } from "@reduxjs/toolkit";

// Initial storage check
const savedUser = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null;

const authSlice = createSlice({
  name: "auth",
  // initialState mein hi storage check karo
initialState: {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  token: localStorage.getItem("token") || null,
  loading: false, 
  error: null,
},
  // features/auth/auth.slice.js

reducers: { 
  setUser: (state, action) => {
    state.user = action.payload;
    if (action.payload) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      // 🚀 THE FIX: Agar payload mein token hai toh usey alag se save karo
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
      }
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    state.loading = false; 
  },
  logout: (state) => {
    state.user = null;
    state.loading = false;
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // 🚀 Token bhi saaf karo
  }
}
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;