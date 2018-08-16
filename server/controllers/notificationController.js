import express from 'express';
import Notification from '../models/notification';
import validateNotification from '../helpers/validations/validateNotification';
import verifyToken from '../helpers/verifyAuthentication';

const router = express.Router();


// Verify token sent through requests and append userId to req.body
verifyToken(router);

const notification = new Notification();

// Update Reminder Settings
router.put('/settings/notifications', validateNotification.Settings, (req, res) => {
  const errors = validateNotification.validationResult(req);
  if (errors.isEmpty()) {
    notification.userId = req.body.userId;
    notification.updateNotification(req.body.reminder, req.body.title)
      .then((updatedNotification) => {
        res.status(200).json({ status: 'Success', updatedNotification, message: 'Settings updated succesFully' });
      })
      .catch(() => {
        res.status(500).json({ status: 'Failed', message: "Problem updating settings or seetings doesn't exist" });
      });
  } else {
    res.status(400).json({ status: 'Failed', message: errors.array()[0].msg });
  }
});

// Update Reminder Settings
router.get('/settings/notifications', (req, res) => {
  notification.userId = req.body.userId;
  notification.getAllNotifications()
    .then((notifications) => {
      res.status(200).json({ status: 'Success', notifications, message: 'Notifications Retrived' });
    })
    .catch(() => {
      res.status(500).json({ status: 'Failed', message: 'Problem getting notifications' });
    });
});

export default router;
