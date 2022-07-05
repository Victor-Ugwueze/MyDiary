import cron from 'node-cron';
import nodeMailer from 'nodemailer';
import Notification from '../../models/notification';


const sendMail = (user, transporter, jobTitle) => {
  const mailOptions = {
    from: '<Noreply@mydairyonline.com>',
    to: `${user.email}`,
    subject: `This is an email ${jobTitle}`,
    text: `Hi ${user.first_name} we want to remind you to write your journal`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      throw (error);
    }
  });
};

const dispatchJob = (schedule, jobTitle, transporter) => {
  cron.schedule('* 0 * * *', () => {
    const notification = new Notification();
    notification.getNotification(jobTitle)
      .then((result) => {
        result.forEach((user) => {
          sendMail(user, transporter, jobTitle);
        });
      })
      .catch();
  });
};

const registerCronJob = () => {
  const transporter = nodeMailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  // Write journal reminder
  dispatchJob('* 0 * * *', transporter, 'journal');

  // Send newsletter
  dispatchJob('0 0 1 * *', transporter, 'mewsletter');
};


export default registerCronJob;
