const MessageQueue = require("../models/MessageQueue");
const User = require("../models/User");

const externalChannels = ["email", "whatsapp", "sms"];

const buildAudienceQuery = (notification) => {
  const query = {
    schoolId: notification.schoolId,
    isActive: true,
  };

  if (notification.targetScope === "department" && notification.targetDepartmentId) {
    query.department = notification.targetDepartmentId;
  }

  if (notification.targetRoles?.length) {
    query.role = { $in: notification.targetRoles };
  }

  return query;
};

const getRecipientForChannel = (user, channel) => {
  if (channel === "email") {
    return user.email;
  }

  const phoneField = user.customFields?.find((field) =>
    ["phone", "mobile", "whatsapp"].includes(field.key.toLowerCase()),
  );

  return phoneField?.value || "";
};

const normaliseChannels = (channels = []) =>
  [...new Set(channels)].filter((channel) => externalChannels.includes(channel));

const enqueueNotificationMessages = async (notification, channels = []) => {
  const resolvedChannels = normaliseChannels(channels);

  if (!resolvedChannels.length) {
    return [];
  }

  const audience = await User.find(buildAudienceQuery(notification)).select(
    "email customFields",
  );
  const queueItems = [];

  audience.forEach((user) => {
    resolvedChannels.forEach((channel) => {
      const recipient = getRecipientForChannel(user, channel);

      if (recipient) {
        queueItems.push({
          notificationId: notification._id,
          schoolId: notification.schoolId,
          channel,
          recipient,
          status: "pending",
          scheduledAt: new Date(),
        });
      }
    });
  });

  if (!queueItems.length) {
    return [];
  }

  return MessageQueue.insertMany(queueItems);
};

module.exports = {
  buildAudienceQuery,
  enqueueNotificationMessages,
};
