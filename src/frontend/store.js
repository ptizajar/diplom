import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action) => {
      // Обновляем только переданные поля, остальные оставляем как есть
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      };
    },
  },
});

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export const { setUser, updateUser } = userSlice.actions;