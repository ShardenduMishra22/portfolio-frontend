import emailjs from "emailjs-com";
emailjs.init(process.env.NEXT_PUBLIC_PUBLIC_ID!)

export const SendEmail = ({ name, email, message }: { name: string; email: string; message: string }) => {
    const time = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID!,
        process.env.NEXT_PUBLIC_TEMPLATE_ID!,
        {
            name: name,
            time: time,
            email: email,
            message: message,
        }
    );
};
