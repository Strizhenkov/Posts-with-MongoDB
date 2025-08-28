import {Types} from 'mongoose';
import type {Model, Document} from 'mongoose';

export class DBUnit<T extends Document> {
    constructor(protected model: Model<T>) {}

    public async create(data: Partial<T>) : Promise<T>{
        const doc = new this.model(data);
        return await doc.save();
    }

    public async deleteById(id: string) : Promise<T | null> {
        if (!id || !Types.ObjectId.isValid(id)) {return null;}
        return await this.model.findByIdAndDelete(id);
    }

    public async findById(id: string) : Promise<T | null> {
        if (!id || !Types.ObjectId.isValid(id)) {return null;}
        return await this.model.findById(id);
    }

    public async findAll() : Promise<T[]> {
        return await this.model.find({});
    }
}