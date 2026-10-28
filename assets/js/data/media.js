/* =====================================================================
   media.js — «تولیدات» (چندرسانه‌ای): نماهنگ، تیزر، موشن‌گرافیک، پوستر، عکس
   ---------------------------------------------------------------------
   ⚠️ همه نمونه‌اند (TODO مالک: کلیپ‌ها/پوسترهای واقعی).

   فیلدها:
     id     شناسهٔ یکتا       title  عنوان       kind  یکی از slugهای MEDIA_TYPES
     year   سال               desc   توضیحِ کوتاه
     ratio  نسبتِ تصویر: "16:9" | "4:5" | "2:3" | "1:1" | "3:4"
     image  "assets/img/media/x.jpg" (اختیاری؛ خالی = تصویرِ موقتِ رنگی)
     embed  نشانیِ embedِ ویدیو در آپارات/یوتیوب (اختیاری؛ در لایت‌باکس پخش می‌شود)
     colors دو رنگ برای تصویرِ موقت
   ===================================================================== */
window.MEDIA_TYPES = [
  { slug: "musicvideo", title: "نماهنگ" },
  { slug: "teaser", title: "تیزر و آنونس" },
  { slug: "motion", title: "موشن‌گرافیک" },
  { slug: "poster", title: "پوستر" },
  { slug: "photo", title: "عکس" },
];

window.MEDIA = [
  { id: "m-hamseda", title: "نماهنگِ «هم‌صدا»", kind: "musicvideo", year: "1405", ratio: "16:9", desc: "نماهنگی دربارهٔ امید و همدلی. (نمونه)", colors: ["#1a1446", "#8a6bd1"] },
  { id: "m-parvaz-teaser", title: "تیزرِ «پرواز بر فراز شهر»", kind: "teaser", year: "1405", ratio: "16:9", desc: "تیزرِ رسمیِ فیلم. (نمونه)", colors: ["#3b0d18", "#c23b4e"] },
  { id: "m-poster-nahang", title: "پوسترِ «نهنگِ آبی»", kind: "poster", year: "1404", ratio: "2:3", desc: "پوسترِ اصلیِ انیمیشن. (نمونه)", colors: ["#06283d", "#1f9bd1"] },
  { id: "m-motion-tarikh", title: "موشن‌گرافیکِ «یک قرن سینما»", kind: "motion", year: "1404", ratio: "16:9", desc: "روایتی تصویری از تاریخِ سینما. (نمونه)", colors: ["#2b2410", "#c9a227"] },
  { id: "m-poster-rah", title: "پوسترِ «راهِ خاکی»", kind: "poster", year: "1404", ratio: "2:3", desc: "پوسترِ مستند. (نمونه)", colors: ["#2a1a0e", "#c9772e"] },
  { id: "m-photo-poshte", title: "پشتِ صحنهٔ «خانه‌ای در مه»", kind: "photo", year: "1405", ratio: "4:5", desc: "عکسِ پشتِ صحنه. (نمونه)", colors: ["#1a1730", "#6d5bd0"] },
  { id: "m-baran", title: "نماهنگِ «باران»", kind: "musicvideo", year: "1404", ratio: "16:9", desc: "نماهنگ. (نمونه)", colors: ["#0b2a3a", "#3d8fb3"] },
  { id: "m-motion-ab", title: "موشن‌گرافیکِ «قطره»", kind: "motion", year: "1403", ratio: "1:1", desc: "موشن‌گرافیکِ اطلاع‌رسانی دربارهٔ مصرفِ آب. (نمونه)", colors: ["#0f2f1f", "#3fae6a"] },
  { id: "m-teaser-khane", title: "آنونسِ «خانه‌ای در مه»", kind: "teaser", year: "1405", ratio: "16:9", desc: "آنونسِ سریال. (نمونه)", colors: ["#151024", "#9a7be0"] },
  { id: "m-photo-dast", title: "قابی از «دست‌ها»", kind: "photo", year: "1402", ratio: "3:4", desc: "عکسِ مستند. (نمونه)", colors: ["#2b2410", "#b89a3e"] },
  { id: "m-poster-atash", title: "پوسترِ «آتش زیر خاکستر»", kind: "poster", year: "1403", ratio: "2:3", desc: "پوستر. (نمونه)", colors: ["#2b1408", "#d1612b"] },
  { id: "m-vatan", title: "نماهنگِ «سرزمینِ من»", kind: "musicvideo", year: "1403", ratio: "16:9", desc: "نماهنگ. (نمونه)", colors: ["#3a1630", "#d15b8e"] },
];
