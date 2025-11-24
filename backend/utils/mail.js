"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendEmail = async (to, subject, html) => {
    try {
        to = "zenituagasma5@gmail.com";
        const email = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to,
            subject,
            html,
        });
        return email;
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=mail.js.map