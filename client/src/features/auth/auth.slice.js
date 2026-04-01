import { createSlice } from "@reduxjs/toolkit";

// 🛡️ Helper to get user from storage safely
const savedUser = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: savedUser, // 🚀 Now it persists on reload!
    loading: false,  // Set to false by default unless fetching
    error: null,
  },
  reducers: { 
    setUser: (state, action) => {
      state.user = action.payload;
      // ✅ SUCCESS: Save to localStorage so Sockets can find it
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload; 
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // 🧹 Clean up
    }
  },
});

export const { setUser, setLoading, setError, logout } = authSlice.actions;
export default authSlice.reducer;

