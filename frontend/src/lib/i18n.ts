import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// English Translations
const en = {
  translation: {
    sidebar: {
      dashboard: "Dashboard",
      services: "Services",
      zones: "Zones",
      bookings: "Bookings",
      chats: "Chats",
      reports: "Reports",
      users: "Users",
      permissions: "Permissions",
      logs: "System Logs",
      logout: "Logout",
    },
    dashboard: {
      title: "Dashboard",
      totalBookings: "Total Bookings",
      pendingRequests: "Pending Requests",
      confirmedEvents: "Confirmed Events",
      mostPopularService: "Most Popular Service",
      capacityChoice: "Capacity Choice",
      topZone: "Top Zone",
      busiestMonth: "Busiest Month",
      monthlyTrend: "Monthly Bookings Trend",
      eventCalendar: "Event Calendar",
      eventsFor: "Events for",
      selectedDate: "Selected Date",
      noEvents: "No events scheduled for this day.",
      noEventsShort: "No events.",
    },
    reports: {
      title: "Booking Reports",
      generatedOn: "Generated on",
      exportPdf: "Export PDF",
      printTitle: "Eaten - Booking Analytics Report",
      completionRate: "Completion Rate",
      confirmedVsRequests: "Confirmed vs Requests",
      pendingActions: "Pending Actions",
      requireAttention: "Require attention",
      cancelled: "Cancelled",
      cancellationRate: "cancellation rate",
      bookingStatusDist: "Booking Status Distribution",
      breakdownStatus: "Breakdown of current booking statuses",
      eventTypeAnalysis: "Event Type Analysis",
      mostRequestedTypes: "Most requested types of events",
      capacityPreferences: "Capacity Preferences",
      popularSizes: "Which event sizes are most popular?",
      noData: "No data available for reports.",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      actions: "Actions",
    },
  },
};

// Arabic Translations
const ar = {
  translation: {
    sidebar: {
      dashboard: "لوحة التحكم",
      services: "الخدمات",
      zones: "المناطق",
      bookings: "الحجوزات",
      chats: "المحادثات",
      reports: "التقارير",
      users: "المستخدمين",
      permissions: "الصلاحيات",
      logs: "سجلات النظام",
      logout: "تسجيل الخروج",
    },
    dashboard: {
      title: "لوحة التحكم",
      totalBookings: "إجمالي الحجوزات",
      pendingRequests: "طلبات معلقة",
      confirmedEvents: "فعاليات مؤكدة",
      mostPopularService: "الخدمة الأكثر طلباً",
      capacityChoice: "السعة المفضلة",
      topZone: "المنطقة الأفضل",
      busiestMonth: "الشهر الأكثر ازدحاماً",
      monthlyTrend: "اتجاه الحجوزات الشهري",
      eventCalendar: "تقويم الفعاليات",
      eventsFor: "فعاليات ليوم",
      selectedDate: "اليوم المحدد",
      noEvents: "لا توجد فعاليات مجدولة لهذا اليوم.",
      noEventsShort: "لا توجد فعاليات.",
    },
    reports: {
      title: "تقارير الحجوزات",
      generatedOn: "تم الإنشاء في",
      exportPdf: "تصدير PDF",
      printTitle: "Eaten - تقرير تحليلات الحجوزات",
      completionRate: "معدل الإنجاز",
      confirmedVsRequests: "المؤكدة مقابل الطلبات",
      pendingActions: "إجراءات معلقة",
      requireAttention: "تتطلب اهتماماً",
      cancelled: "ملغاة",
      cancellationRate: "معدل الإلغاء",
      bookingStatusDist: "توزيع حالات الحجز",
      breakdownStatus: "تفاصيل حالات الحجز الحالية",
      eventTypeAnalysis: "تحليل أنواع الفعاليات",
      mostRequestedTypes: "أنواع الفعاليات الأكثر طلباً",
      capacityPreferences: "تفضيلات السعة",
      popularSizes: "ماهي الأحجام الأكثر طلباً؟",
      noData: "لا توجد بيانات متاحة للتقارير.",
    },
    common: {
      loading: "جاري التحميل...",
      error: "خطأ",
      success: "نجاح",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      add: "إضافة",
      actions: "إجراءات",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      ar,
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Update document direction on language change
i18n.on("languageChanged", (lng) => {
  document.dir = lng === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
