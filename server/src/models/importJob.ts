import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../services/sequelize";

export class ImportJob extends Model<InferAttributes<ImportJob>, InferCreationAttributes<ImportJob>> {
    id: CreationOptional<number>;
    bookId: string;
    url: string;
    type: "word" | "pdf"| "wattpad"| "evernote";
    state: 'pending' | 'finished';
}

ImportJob.init({
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true
    },
    bookId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ["word", "pdf", "wattpad", "evernote"],
        allowNull: false
    },
    state: {
        type: DataTypes.ENUM,
        values: ['pending', 'finished'],
        allowNull: false,
        defaultValue: 'pending'
    }
}, { sequelize })
