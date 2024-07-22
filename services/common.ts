import { model } from 'mongoose';
import models from '../model/userModel';
import user from '../types/user';
import bcrypt from 'bcrypt';

interface FetchUserResponse {
    success: boolean;
    user?: user;
}

interface UpdateProfileResponse {
    success: boolean;
}

const SALT_ROUNDS = 10;

const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

const getUserDetails = (email: string): Promise<FetchUserResponse> => {
    return new Promise((resolve, reject) => {
        models.UserModel.findOne({ email })
            .then((user: any) => {
                if (!user) {
                    resolve({ success: false });
                } else {
                    resolve({
                        success: true,
                        user: {
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            userName: user.userName,
                            password: user.password,
                            email: user.email,
                            mobileNumber: user.mobileNumber,
                        }
                    });
                }
            })
            .catch((error: any) => {
                console.error('Error in fetching details:', error);
                reject({ success: false });
            });
    });
}

const updateProfile = async (userDetailsToUpdate: user): Promise<UpdateProfileResponse> => {
    return new Promise(async (resolve, reject) => {
        userDetailsToUpdate.password = await hashPassword(userDetailsToUpdate.password);
        const result = await models.UserModel.updateOne(
            { email: userDetailsToUpdate.email },
            {
                firstName: userDetailsToUpdate.firstName,
                lastName: userDetailsToUpdate.lastName,
                userName: userDetailsToUpdate.userName,
                password: userDetailsToUpdate.password,
                mobileNumber: userDetailsToUpdate.mobileNumber
            })
            .then((responseAfterUpdateProfile: any) => {
                resolve({
                    success: true
                });
            })
            .catch((error: any) => {
                console.error('Error in updating Profile:', error);
                reject({ success: false });
            });

    });
}

export default { getUserDetails, updateProfile };