import { userObject } from './../../Types/types';
import bcrypt from "bcryptjs";

export const checkPassword = async (password: string, user: userObject) => {
    const isPasseword = await bcrypt.compare(password, user.password);
    return isPasseword;
}

