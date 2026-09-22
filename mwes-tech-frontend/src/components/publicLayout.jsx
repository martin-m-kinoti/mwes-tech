import { Outlet } from "react-router-dom";
import SiteGuideAssistant from "./siteGuideAssistant";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function PublicLayout() {
    return (
        <>
            <Outlet />
            <SiteGuideAssistant apiEndpoint={`${API_BASE}/api/assistant`} />
        </>
    )
}