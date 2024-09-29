import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  name: "",
  email: "",
  profilePicture: "",
  isLoggedIn: false,
  isAdmin: false,
  isLibrarian: false,
  authType: "",
  _id: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const {
        name,
        email,
        profilePicture,
        isAdmin,
        authType,
        _id,
        isLibrarian,
      } = action.payload;
      state.name = name;
      state.email = email;
      state.profilePicture = profilePicture;
      state.isLoggedIn = true;
      state.isAdmin = isAdmin;
      state.authType = authType;
      state._id = _id;
      state.isLibrarian = isLibrarian;
    },
    logoutUser: (state) => {
      state.name = "";
      state.email = "";
      state.profilePicture = "";
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.authType = "";
      state._id = "";
      state.isLibrarian = false;
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
