import cron from 'node-cron';
import nodeMailer from 'nodemailer';
import Notification from '../../models/notification';


const sendMail = (user, transporter) => {
  const mailOptions = {
    from: '<Noreply@mydairyonline.com>',
    to: `${user.email}`,
    subject: 'This is a cron job email testing',
    text: `Hi ${user.first_name} we want to remind you to write your journal`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw (error);
    } else {
      console.log(info);
    }
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

  cron.schedule('20 * * * *', () => {
    console.log('Running cron job every minuites');
    const notification = new Notification();
    notification.getNotification('journal')
      .then((result) => {
        result.forEach((user) => {
          sendMail(user, transporter);
        });
      })
      .catch(err => console.log(err.message));
  });
};


export default registerCronJob;
