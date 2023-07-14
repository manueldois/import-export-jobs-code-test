import { Attributes, CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/sequelize";

export class ExportJob extends Model<InferAttributes<ExportJob>, InferCreationAttributes<ExportJob>> {
    id: CreationOptional<number>;
    bookId: string;
    type: 'epub' | 'pdf';
    state: 'pending' | 'finished';
}

ExportJob.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
    },
    bookId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ['epub', 'pdf'],
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM,
        values: ['pending', 'finished'],
        allowNull: false,
        defaultValue: 'pending'
    }
}, { sequelize })

