"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = __importDefault(require("zod"));
const router = express_1.default.Router();
const todoInput = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string(),
    done: zod_1.default.boolean(),
});
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.json({
                "msg": "please signin/signup to add todo"
            });
        }
        const { success } = todoInput.safeParse(body);
        if (!success) {
            return res.json({
                "msg": "please provide valid title description and done in valid format"
            });
        }
        else {
            const token = authHeader.split(' ')[1];
            const user_decoded = jsonwebtoken_1.default.verify(token, "secret_password");
            const added_todo = yield prisma.todo.create({
                data: {
                    title: body.title,
                    description: body.description,
                    done: body.done,
                    userId: user_decoded.id
                }
            });
            return res.json({
                user_decoded,
                added_todo,
                "msg": "inside from add todo",
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({
            "msg": "error",
            e
        });
    }
}));
exports.default = router;
