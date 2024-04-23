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
const router = express_1.default.Router();
const signupInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(req.body);
    try {
        const responce = signupInput.safeParse(body);
        if (!responce.success) {
            return res.json({
                "msg": "please send a valid email and password should be of min 6 charcters"
            });
        }
        else {
            //store user in the database
            //issue a token to the user that signup
            return res.json({
                "msg": "successfully sign up",
            });
        }
    }
    catch (e) {
        console.log(e);
    }
}));
router.get("/", (req, res) => {
    return res.json({
        "msg": "from user route",
    });
});
exports.default = router;
