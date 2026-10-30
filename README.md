# Digital Invitation:

A black-and-gold digital invitation card that behaves like a web app.

The main page contains the Invitation, Calendar and RSVP. **Location** and **Contact** are not shown on the page; they slide up as panels from the navigation bar when a guest taps the tab.

## File structure

```
ayra-haq-invitation/
├─ index.html          Page structure (no need to change)
├─ css/style.css       Look and animation (main colours are at the top)
├─ js/
│  ├─ config.js        EVERYTHING you edit
│  └─ app.js           Logic and animation (no need to change)
└─ assets/
   ├─ images/          Put images here
   ├─ video/           Put videos here
   └─ music/           Put songs here
```

## Try it in VS Code

1. Open the `ayra-haq-invitation` folder in VS Code (File > Open Folder).
2. Install the **Live Server** extension.
3. Right-click `index.html` and choose **Open with Live Server**.

Save `config.js` and the page reloads by itself.

## What to edit in `js/config.js`

| Section | Purpose |
|---|---|
| `couple` | Names and monogram letters |
| `event` | Date, time, venue, address, map search words |
| `names` | Day and month names (change these to switch language) |
| `features` | Show or hide sections (video, gallery, countdown, tabs and more) |
| `images` | Couple photo, gallery, and venue photo (shown in the Location panel if filled in) |
| `video` | Video file or YouTube link |
| `music` | Song file and volume |
| `contacts` | Names and phone numbers for the Contact panel (WhatsApp and call icons) |
| `rsvp` | WhatsApp number that receives RSVPs |
| `theme` and `flora` | Page, flower and gold dust colours |
| `text` | Every sentence and label on the card |

In text, codes like `{bride}`, `{groom}`, `{venue}`, `{day}`, `{monthShort}`, `{year}` and `{dayName}` are replaced automatically from your names and date.

## Changing images

1. Put the image in `assets/images/`, for example `couple.jpg`.
2. In `config.js`:

```js
images: {
  portrait: "assets/images/couple.jpg",
  gallery: [
    { src: "assets/images/gallery1.jpg", alt: "Photo 1", label: "Photo 1" },
    { src: "assets/images/gallery2.jpg", alt: "Photo 2", label: "Photo 2" }
  ],
  location: "assets/images/venue.jpg"
}
```

You can add or remove gallery photos. A portrait 3:4 photo suits `portrait`. Set `""` to go back to the blank frame.

## Adding a video

```js
video: { src: "assets/video/our-story.mp4", poster: "assets/images/poster.jpg" }
```

Or use YouTube: `embedUrl: "https://www.youtube.com/embed/VIDEO_ID"`. The YouTube option only works once the page is hosted on your own website. To remove the video section, set `features.video` to `false`.

## Adding music

Put the song in `assets/music/`, then set `music.src: "assets/music/song.mp3"`. If empty, the built-in ambient music plays. Make sure you have the right to use the song.

## Phone numbers

Write them with the country code, without `+`, spaces or dashes:

```js
contacts: [
  { role: "The Bride", name: "Ayra", phone: "60123456789" },
  { role: "The Groom", name: "Haq", phone: "60198765432" }
]
```

After that the WhatsApp and call icons in the Contact panel become active, and RSVP messages can be sent straight to the first contact's number (or the number in `rsvp.whatsapp`).

## Still to fill in

- `text.intro.hostNames`: parents' names (currently `[Father's Name] & [Mother's Name]`)
- `event.address`: full address
- `event.startTime` and `event.timeText`: event time
- phone numbers in `contacts`
- images and video

## Changing fonts

Fonts load from Google Fonts through the link in `index.html` and are named in `css/style.css` (`--f-display`, `--f-script`, `--f-ui`, `--f-arabic`). An internet connection is needed to see the original fonts.

## Putting it online

Upload the whole folder to any static hosting service (Netlify, GitHub Pages, Cloudflare Pages and others). No server or database is needed.
