import { User } from '../database/models/user';

export const create = async (name: string, surname: string, username: string, password: string, email: string): Promise<any> => {
    return await User.create({ name, surname, username, password, email });
}

export const getUser = async (username: string):Promise<any> => {
    const user = await User.findOne({username});
    return user;
}