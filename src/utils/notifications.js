// Utility to handle browser notifications
export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notification");
        return false;
    }

    if (Notification.permission === "granted") {
        return true;
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission === "granted";
    }

    return false;
};

export const sendNotification = (title, body) => {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body,
            icon: "/logo192.png" // Path to your app icon
        });
    }
};

// Simple reminder scheduler (runs while app is open)
export const scheduleReminder = (hours = 4) => {
    const ms = hours * 60 * 60 * 1000;
    setInterval(() => {
        sendNotification(
            "Mentora Check-in",
            "How are you feeling right now? Take a moment to log your mood. ✨"
        );
    }, ms);
};
