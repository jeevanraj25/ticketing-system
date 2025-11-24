import { Resend } from "resend";


 const resend = new Resend(process.env.RESEND_API_KEY);



 export const sendEmail = async (to : string, subject: string, html: string) => {
    try{
        to = "zenituagasma5@gmail.com";
    
        const email = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to,
            subject,
            html,
        });

       
        return email;
    } catch (error) {
        console.log(error);
        return error;       

    }
};