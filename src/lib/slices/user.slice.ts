import { ApiBase } from '@/interfaces/api-base.interface'
import { createSlice } from '@reduxjs/toolkit'

export interface User extends ApiBase {
  name: string
  email: string
  phone: string
  ubication: string
  company_type: string
  balance_type: string
}

const UserEmptyState: User = {} as User

export const userSlice = createSlice({
  name: 'user',
  initialState: UserEmptyState,
  reducers: {
    createUser: (_state, action) => {
      return action.payload
    },
    modifyUser: (state, action) => {
      const formattedData = { ...state, ...action.payload }
      return formattedData
    },
    resetUser: () => {
      return UserEmptyState
    }
  }
})

// Action creators are generated for each case reducer function
export const { createUser, modifyUser, resetUser } = userSlice.actions

export default userSlice.reducer
