import { NonRetriableError } from "inngest";
import { prisma } from "../../db/prisma"
import { inngest } from "../client";
import { sendEmail } from "../../utils/mail";



export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup",retries:2},
    { event: "user.signup" },
    async ({event, step}) => {
        try {
            const { email } = event.data;

         const user =  await step.run("get user signup", async () => {
             const user =  await prisma.user.findUnique({
                    where :{
                        email:email
                    }
            });

            if(!user){
                throw new NonRetriableError("User not found in the Database");
            }
                 return user;
            });

            await step.run("send Welcome email", async () => {
                const subject = "Welcome to AI Agents!";
                const html = `<h1>Welcome to AI Agents, ${user.email}!</h1>
                <p>We're excited to have you on board. Get ready to explore the power of AI-driven agents.</p>
                <p>Best regards,<br/>The AI Agents Team</p>
                `;
                await sendEmail(user.email, subject, html);
            })

             return {success:true};
        } catch (error) {
            console.log("error ",error)
            return {success:false};
        }
    }
);
