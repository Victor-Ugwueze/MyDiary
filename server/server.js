import dotenv from 'dotenv';
import app from './app';
import registerCronJob from './helpers/cron-jobs/email-schedule';

dotenv.config();
const port = process.env.PORT;
app.listen(port, () => {
  registerCronJob();
  console.log(`Server startted on port: ${port}`);
});

export default app;
