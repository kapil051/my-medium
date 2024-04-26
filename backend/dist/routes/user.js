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
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
const signupInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const responce = signupInput.safeParse(body);
        if (!responce.success) {
            return res.json({
                "msg": "please send a valid email and password should be of min 6 charcters"
            });
        }
        else {
            const saved_user = yield prisma.user.create({
                data: body,
            });
            const token = jsonwebtoken_1.default.sign({ id: saved_user.id, email: saved_user.email }, "secret_password");
            //store user in the database
            //issue a token to the user that signup
            return res.json({
                token,
                saved_user,
                "msg": "successfully sign up",
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({
            "msg": e,
        });
    }
}));
const signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const { success } = signinInput.safeParse(body);
        if (!success) {
            return res.json({
                "msg": "please send a valid email and password should be of min 6 charcters"
            });
        }
        else {
            const user_found = yield prisma.user.findFirst({
                where: body,
            });
            if (user_found != null) {
                const token = jsonwebtoken_1.default.sign({ id: user_found.id, email: user_found.email }, "secret_password");
                return res.json({
                    user_found,
                    token,
                });
            }
            else {
                return res.json({
                    user_found,
                    "msg": "no valid user for this email and password"
                });
            }
        }
    }
    catch (e) {
        console.log(e);
        return res.json({
            "msg": e,
        });
    }
}));
router.get("/allUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all_users = yield prisma.user.findMany();
        if (!all_users) {
            return res.json({
                "msg": "no user present in the database",
            });
        }
        else {
            return res.json({
                all_users
            });
        }
    }
    catch (e) {
        console.log(e);
        return res.json({
            "msg": e,
        });
    }
}));
exports.default = router;
