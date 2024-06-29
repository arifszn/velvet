import cron from 'node-cron';

export const bootstrapCronJob = (): void => {
  cron.schedule('* * * * *', () => {
    //
  });
};
