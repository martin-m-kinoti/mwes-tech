import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { app } from "./firebase";

const analytics = getAnalytics(app);

export const track = (name, params = {}) => logEvent(analytics, name, params);
export const identify = (uid) => setUserId(analytics, uid);
export const setRole = (role) => setUserProperties(analytics, { role });