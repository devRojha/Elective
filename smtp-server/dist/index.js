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
const nodemailer_1 = __importDefault(require("nodemailer"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3012;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const sendEmail = (senderEmail, senderPassword, recivers, message) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPassword,
        },
    });
    const mailOptions = {
        from: senderEmail,
        to: recivers.join(','),
        subject: 'Elective Notification',
        text: `${message}\n\nWebsite : https://elective.vercel.app`,
    };
    const emailResponse = yield transporter.sendMail(mailOptions);
    console.log('Email sent:', emailResponse);
});
app.post('/send-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorEmail, authorTxt, recivers, message } = req.body;
    if (!authorEmail || !authorTxt || !recivers || !message) {
        return res.status(400).json({ msg: 'Missing required fields' });
    }
    try {
        yield sendEmail(authorEmail, authorTxt, recivers, message);
        res.status(200).json({ msg: 'Email sent successfully' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ msg: 'Failed to send email', error: error.message });
    }
}));
app.listen(port, () => {
    console.log(`Email server running at http://localhost:${port}`);
});
