import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig';

class UserModel extends Model {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public userName!: string;
    public password!: string;
    public email!: string;
    public mobileNumber!: number;
    public userRole!: string;
}

UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    mobileNumber: {
        type: DataTypes.BIGINT,
        allowNull: false,
    },
    userRole: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users',
});

export default UserModel;
