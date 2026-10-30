/* =====================================================================
   INVITATION SETTINGS  -  EDIT THIS FILE ONLY
   All text, dates, images, video, music, phone numbers and colours
   live here. You do not need to change index.html, style.css or app.js.

   Tips:
   - In text, {bride}, {groom}, {venue}, {day}, {monthShort}, {year},
     {dayName}, {dd}, {mm}, {yy} are replaced automatically.
     Example: "The Nikah Ceremony of {bride} & {groom}"
   - Do not delete the quotation marks " " or the commas at line ends.
   - Leave "" (empty) to clear something.
   ===================================================================== */

window.INVITATION = {

  /* ---------- 1. Basics ---------- */
  meta: {
    title: "{bride} & {groom} Nikah Invitation"      // browser tab title
  },

  couple: {
    bride: "Fasya",
    groom: "Hakeem",
    connector: "&",          // word between the two names
    initials: ["F","H"],      // monogram letters on the opening screen
    //monogramAmp: "&"
  },

  /* ---------- 2. Date, time and place ---------- */
  event: {
    year: 2026,
    month: 12,                  // 1 = January ... 12 = December
    day: 26,
    startTime: "",             // e.g. "11:00" (24-hour). Empty = all day
    endTime: "",               // e.g. "16:00". Empty = 3 hours after the start
    timeText: "",              // time shown on the card, e.g. "11.00 am - 4.00 pm"
    timezone: "Asia/Kuala_Lumpur",

    venue: "Crystal Hall, Bukit Jelutong",          // shown on the card
    venueLines: ["Crystal Hall", "Bukit Jelutong"],            // venue split over 2 lines on the card
    address: "Please park at Level 1, opposite Grand Premier Hall. Then, take the escalator up to Crystal Hall.",           // shown in the Location panel
    mapQuery: "Crystal Hall, Bukit Jelutong",                   // search words for Google Maps / Waze
    googleMapsUrl: "https://maps.app.goo.gl/i3gFoqPwutodeJ2F9?g_st=aw",                             // optional: paste the exact Google Maps link
    wazeUrl: "https://ul.waze.com/ul?place=ChIJLQ_0vPpNzDERk2WyDFNI0ac&ll=3.10481920%2C101.53499920&navigate=yes&utm_campaign=default&utm_source=waze_website&utm_medium=lm_share_location"                                    // optional: paste the exact Waze link
  },

  /* ---------- 3. Names of days and months (change to switch language) ---------- */
  names: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    monthsLong: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },

  /* ---------- 4. Features (true = show, false = hide) ---------- */
  features: {
    music: true,               // Music tab
    dust: true,                // drifting gold dust
    video: false,               // video section
    gallery: true,             // photo gallery
    calendar: true,            // Calendar tab and section
    countdown: true,           // countdown timer
    location: true,            // Location tab and panel
    contacts: true,            // Contact tab and panel
    rsvp: true                 // RSVP tab and section
  },

  /* ---------- 5. Images ---------- */
  /* Put image files in assets/images/ and write the file name here.
     Example: portrait: "assets/images/couple.jpg"
     Empty "" = blank frame (placeholder). */
  images: {
    placeholder: "assets/images/placeholder.svg",
    portrait: "",                                  // arch-shaped couple photo
    photo1: "",                                    // photo above the verse, e.g. "assets/images/photo1.jpg"
    photo2: "",                                    // photo below the verse
    gallery: [                                     // add or remove rows as needed
      { src: "", alt: "Gallery photo 1", label: "Photo 1" },
     //{ src: "", alt: "Gallery photo 2", label: "Photo 2" },
      { src: "", alt: "Gallery photo 3", label: "Photo 3" }
    ],
    location: "",                                  // venue photo or map (shown in the Location panel)
    flowers: "",                                   // old peony photo backdrop (off)
    texture: "assets/images/texture.jpeg",                        // main background. "" = plain dark
  },

  /* ---------- 6. Video ---------- */
  /* Choose one: your own file (src) OR a YouTube embed link (embedUrl).
     embedUrl only works once the page is hosted on your own website. */
  video: {
    src: "",                                       // e.g. "assets/video/our-story.mp4"
    poster: "",                                    // video cover image (optional)
    embedUrl: "",                                  // e.g. "https://www.youtube.com/embed/XXXXXXXXXXX"
    title: "Our story video",
    placeholderLabel: "Place video here"
  },

  /* ---------- 7. Music ---------- */
  /* Empty = built-in ambient music. Or put a file in assets/music/ */
  music: {
    src: "Lana Del Rey - Salvatore (Piano Cover).mp3",                                       // e.g. "assets/music/song.mp3"
    volume: 0.7,                                   // 0 to 1 (for your own file)
    autoplayOnOpen: true                           // start playing when "Open Invitation" is tapped
  },

  /* ---------- 8. Contacts ---------- */
  /* phone: country code + number, without +, spaces or dashes. Example "60123456789" */
  contacts: [
    { role: "", name: "Liza", phone: "0193847231" },
    { role: "", name: "Azmee", phone: "0182424775" },
    { role: "", name: "Shahrul", phone: "01115099621" }
  ],

  /* ---------- 9. RSVP ---------- */
  rsvp: {
    whatsapp: "",              // number that receives RSVPs. Empty = first contact's number
    maxGuests: 10,
    attendance: {
      present: 0,               // confirmed guests before this RSVP
      absent: 0                 // guests unable to attend before this RSVP
    }
  },

  /* ---------- RSVP Database ---------- */
  /* This publishable key is safe in the website only because the database
     rules in supabase/schema.sql restrict what guests can access. */
  supabase: {
    url: "https://qejkxcqlfhsfypmtikwq.supabase.co",
    publishableKey: "sb_publishable_VpICkZpzv0l4nKiAtETzKQ_jVfzRTXf"
  },

  /* ---------- 10. Colours ---------- */
  theme: {
    bg: "#0a0908",             // page background
    bg2: "#14110e",            // card background
    bg3: "#1b1712",            // small boxes
    gold: "#d6b27a",
    goldHi: "#f1dcae",
    goldLo: "#9a7a48",
    text: "#e8dcc6",
    muted: "#a39380"
  },

  /* Dark, moody garden flowers and champagne dust colours */
  flora: {
    tipOuter: "#e2c8c5",       // smoky blush outer petals
    tipInner: "#b88f99",       // muted mauve inner petals
    midOuter: "#76545f",
    midInner: "#3c2d36",
    base: "#161315",           // deep plum petal base
    dust: "#d8bd96"            // champagne dust
  },

  /* ---------- 11. All text ---------- */
  text: {
    nav: { music: "Music", calendar: "Calendar", location: "Location", contact: "Contact", rsvp: "RSVP" },

    common: { close: "Close" },

    cover: {
      kicker: "The Solemnization",
      dateLine: "{dayName}  ·  {day} {monthShort} {year}",
      openButton: "Open",
      // openQuiet: "Open without music"
    },

    bismillah: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",

    intro: {
      title: "An Intimate Affair",
      subtitle: "of love, family & forever",
      hostLabel: "Walimatulurus",
      hostNames: "Mohd Azmee and NorAliza",
      ceremonyLabel: "Joyfully invite you to witness the solemnization of our beloved daughter,",
      coupleNote: "to the love of her life,",
      honour: "Your presence will be a great honour to our families.",
      salam: "",
      invite: "",
      verseArabic: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
      verseMalay: "And We created you in pairs",
      verseRef: "Surah An-Naba’ · verse 8"
    },

    video: { eyebrow: "Our Story" },

    calendar: {
      eyebrow: "Save the Date",
      title: "Calendar",
      monthTitle: "{monthLong} {year}",
      weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      note: "{dayName}, {day} {monthLong} {year}",
      countdownLabel: "Counting down to our special day",
      days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds",
      today: "Today is our special day",
      past: "Alhamdulillah, the celebration has taken place",
      saveButton: "Add to Calendar",
      eventTitle: "The Solemnization of {bride} & {groom}"
    },

    location: {
      eyebrow: "Venue",
      title: "Location",
      googleMaps: "Google Maps",
      waze: "Waze"
    },

    contact: {
      eyebrow: "Questions?",
      title: "Contact",
      intro: "With the blessings of families.",
      copyButton: "Copy number",
      copied: "Copied",
      whatsappLabel: "WhatsApp {name}",
      callLabel: "Call {name}",
      phonePlaceholder: "[Phone number]"
    },

    rsvp: {
      //eyebrow: "Will You Join Us?",
      title: "RSVP",
      intro: "Please fill in this form to confirm your attendance",
      nameLabel: "Your name",
      namePlaceholder: "e.g. Paklong & family",
      attendLabel: "Attendance",
      attendYes: "Yes, I'll be there",
      attendNo: "Sorry, I can't make it",
      guestsLabel: "Number of guests",
      guestsUnit: "guest(s)",
      noteLabel: "Wishes & prayers",
      notePlaceholder: "A note for the Newlyweds",
      submit: "Submit",
      errorName: "Please enter your name.",
      errorSubmit: "Your RSVP could not be submitted. Please try again.",
      thanksYes: "Thank you, see you there",
      thanksNo: "Thank you for your prayers",
      guestbookTitle: "Messages & Wishes",
      wishFallback: "Thank you for your RSVP.",
      guestbookEmpty: "Be the first to leave a wish.",
      attendanceTitle: "Presence",
      attendanceYes: "Present",
      attendanceNo: "Not Present",
      messageLabel: "Your message",
      whatsappButton: "Send via WhatsApp",
      copyButton: "Copy message",
      copied: "Copied",
      selectManual: "Select and copy",
      noteWithWhatsapp: "Tap the WhatsApp button to send this message to the couple.",
      noteNoWhatsapp: "Copy this message and send it to {bride} or {groom} on WhatsApp.",
      editButton: "Edit my answer",
      msgAttend: "Assalamualaikum. I am {name} and I would like to confirm my attendance at the Nikah Ceremony of {bride} & {groom} on {day} {monthShort} {year} at {venue}. Number of guests: {guests}.",
      msgDecline: "Assalamualaikum. I am {name} and I am sorry that I cannot attend the Nikah Ceremony of {bride} & {groom} on {day} {monthShort} {year}. May everything go smoothly.",
      msgNote: "Wishes: {note}"
    },

    footer: {
      wassalam: "Custom your digital card with",
      print: "Ameerul, 010-9605600"
    }
  }
};