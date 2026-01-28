import { useContext } from 'react';
import { AuthContext } from './authContextRef';

export const useAuth = () => useContext(AuthContext);
