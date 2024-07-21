import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/databaseConfig';
import ScanResult from '../types/scanResult';
import UserModel from '../model/userModel';

class scanResultsModel extends Model {
    public id!: number;
    public fileName!: string;
    public scanResult!: ScanResult;
}

scanResultsModel.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    fileName: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: false
    },
    scanResult: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        allowNull: false,
        primaryKey: false
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: UserModel,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    sequelize,
    tableName: 'scanresults',
});

export default scanResultsModel;
