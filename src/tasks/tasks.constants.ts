export const TASK_SCHEDULER_INTERVAL = 1000 * 60 * 60 * 24 // 24 hours

export const TASK_CRONS = {
  YEARLY: '0 0 1 1 *',
  MONTHLY: '0 0 1 * *',
  WEEKLY: '0 0 * * 0',
  DAILY: '0 0 * * *',
  HOURLY: '0 * * * *',
  MINUTELY: '* * * * *',
  SECONDLY: '* * * * * *',
  BI_WEEKLY: '0 0 * * 0,14',
  QUARTERLY: '0 0 1 4,7,10,13',
  BI_MONTHLY: '0 0 1 1,15',
  EACH_SATURDAY: '0 0 * * 6',
  EACH_SUNDAY: '0 0 * * 0',
  EACH_MONDAY: '0 0 * * 1',
  EACH_TUESDAY: '0 0 * * 2',
  EACH_WEDNESDAY: '0 0 * * 3',
  EACH_THURSDAY: '0 0 * * 4',
  EACH_FRIDAY: '0 0 * * 5',
  EVERY_DAY_EIGHT_OCLOCK: '0 8 * * *',
  EVERY_SIX_HOURS: '0 */6 * * *',
}
