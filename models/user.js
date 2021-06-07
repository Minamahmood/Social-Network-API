const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
            username: {
                type: String,
                required: true,
                trim: true,
                unique: true
            },