/* =====================================================================
   INVITATION LOGIC  -  no need to change.
   All content comes from js/config.js
   ===================================================================== */
(function () {
  "use strict";
  var CFG = window.INVITATION;
  if (!CFG) { document.body.textContent = "js/config.js could not be loaded."; return; }
  var FL = CFG.flora, E = CFG.event, FT = CFG.features;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var PH = CFG.images.placeholder;

  /* ---------- Dates and text formatting ---------- */
  var DAYS = CFG.names.days, MLONG = CFG.names.monthsLong, MSHORT = CFG.names.monthsShort;
  function p2(n) { return n < 10 ? "0" + n : String(n); }
  var dateObj = new Date(E.year, E.month - 1, E.day);
  var VARS = {
    bride: CFG.couple.bride, groom: CFG.couple.groom, venue: E.venue,
    day: String(E.day), dd: p2(E.day), mm: p2(E.month), yy: String(E.year).slice(-2), year: String(E.year),
    monthShort: MSHORT[E.month - 1], monthLong: MLONG[E.month - 1], dayName: DAYS[dateObj.getDay()], time: E.timeText || ""
  };
  CFG.dateParts = { dayName: VARS.dayName, day: VARS.day, monthYear: VARS.monthShort + " " + VARS.year };
  function fmt(s, extra) {
    return String(s == null ? "" : s).replace(/\{(\w+)\}/g, function (m, k) {
      if (extra && extra[k] != null) return extra[k];
      return VARS[k] != null ? VARS[k] : m;
    });
  }
  function get(path) {
    return path.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, CFG);
  }
  function T(path, extra) { return fmt(get("text." + path), extra); }
  function normPhone(p) { p = String(p == null ? "" : p).replace(/\D/g, ""); if (p.charAt(0) === "0") p = "60" + p.slice(1); return p; }

  /* ---------- Theme ---------- */
  var THEME_VARS = { bg: "--bg", bg2: "--bg-2", bg3: "--bg-3", gold: "--gold", goldHi: "--gold-hi", goldLo: "--gold-lo", text: "--text", muted: "--muted" };
  Object.keys(THEME_VARS).forEach(function (k) { if (CFG.theme && CFG.theme[k]) root.style.setProperty(THEME_VARS[k], CFG.theme[k]); });

  /* ---------- Flower photo backdrop ---------- */
  var floraPath = get("images.flowers");
  var HAS_FLORA = !!floraPath;
  if (HAS_FLORA) {
    var floraUrl = new URL(floraPath, document.baseURI).href;
    var rootEl = document.documentElement;
    rootEl.style.setProperty("--flora", 'url("' + floraUrl + '")');
    rootEl.classList.add("has-flora");
    var fimg = new Image();
    fimg.onload = function () { rootEl.classList.add("flora-ready"); };
    fimg.onerror = function () { console.warn("Flower photo not found: " + floraPath); };
    fimg.src = floraUrl;
  }

  /* ---------- Textured background ---------- */
  (function () {
    var tp = get("images.texture"); if (!tp) return;
    var u = new URL(tp, document.baseURI).href;
    root.style.setProperty("--texture", 'url("' + u + '")');
    root.classList.add("has-texture");
  })();

  /* ---------- Remove disabled features ---------- */
  function removeEl(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }
  function removeTab(target) { removeEl(document.querySelector('.tab[data-target="' + target + '"], .tab[data-sheet="' + target + '"]')); }
  if (!FT.music) removeEl($("tab-music"));
  if (!FT.calendar) { removeEl($("sheet-kalendar")); removeTab("sheet-kalendar"); }
  if (!FT.location) { removeEl($("sheet-lokasi")); removeTab("sheet-lokasi"); }
  if (!FT.contacts) { removeEl($("sheet-hubungi")); removeTab("sheet-hubungi"); }
  if (!FT.rsvp) { removeEl($("rsvp")); removeEl($("guestbook")); removeTab("rsvp"); }
  if (!FT.video) removeEl($("video-block"));
  if (!FT.gallery) removeEl($("gallery"));
  if (!FT.countdown) removeEl($("countdown"));
  $("tabs").style.setProperty("--n", String($("tabs").children.length));

  /* ---------- Fill text from config ---------- */
  document.title = fmt(CFG.meta.title);
  Array.prototype.forEach.call(document.querySelectorAll("[data-text]"), function (el) {
    var v = get(el.getAttribute("data-text"));
    el.textContent = fmt(v);
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-bind-attrs]"), function (el) {
    el.getAttribute("data-bind-attrs").split(";").forEach(function (pair) {
      var i = pair.indexOf(":"); if (i < 0) return;
      el.setAttribute(pair.slice(0, i).trim(), fmt(get(pair.slice(i + 1).trim())));
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-if]"), function (el) {
    var v = get(el.getAttribute("data-if"));
    var ok = Array.isArray(v) ? v.length > 0 : !!v;
    if (!ok) removeEl(el);
  });
  Array.prototype.forEach.call(document.querySelectorAll("img[data-img]"), function (img) {
    var v = get(img.getAttribute("data-img"));
    img.src = v || PH;
    var f = img.closest(".frame");
    if (v && f) f.classList.add("has-photo");
  });
  (function () {
    var ini = CFG.couple.initials && CFG.couple.initials.length ? CFG.couple.initials : [CFG.couple.bride.charAt(0), CFG.couple.groom.charAt(0)];
    var vl = $("venue-lines");
    (E.venueLines && E.venueLines.length ? E.venueLines : [E.venue]).forEach(function (line, i) {
      if (i) vl.appendChild(document.createElement("br"));
      vl.appendChild(document.createTextNode(line));
    });
  })();

  /* ---------- Gallery ---------- */
  (function () {
    var wrap = $("gallery"); if (!wrap) return;
    (CFG.images.gallery || []).forEach(function (g, i) {
      var f = document.createElement("div");
      f.className = "frame" + (g.src ? " has-photo" : "");
      f.setAttribute("data-label", g.label || ("Photo " + (i + 1)));
      var im = document.createElement("img");
      im.className = "ph"; im.src = g.src || PH; im.alt = g.alt || ""; im.loading = "lazy";
      f.appendChild(im); wrap.appendChild(f);
    });
  })();

  /* ---------- Video ---------- */
  (function () {
    var slot = $("video-slot"); if (!slot) return;
    var V = CFG.video;
    if (V.src) {
      var v = document.createElement("video");
      v.className = "video-el"; v.controls = true; v.playsInline = true; v.preload = "metadata";
      if (V.poster) v.poster = V.poster;
      v.src = V.src; v.setAttribute("aria-label", V.title || "Video");
      slot.classList.add("has-photo"); slot.appendChild(v);
    } else if (V.embedUrl) {
      var fr = document.createElement("iframe");
      fr.src = V.embedUrl; fr.title = V.title || "Video"; fr.loading = "lazy"; fr.allowFullscreen = true;
      fr.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture");
      slot.classList.add("has-photo"); slot.appendChild(fr);
    } else {
      slot.setAttribute("data-label", V.placeholderLabel || "Place video here");
    }
  })();

  /* ---------- Helpers ---------- */
  function hex(c) { return [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]; }
  function mix(a, b, t) {
    var A = hex(a), B = hex(b);
    return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * t) + "," + Math.round(A[1] + (B[1] - A[1]) * t) + "," + Math.round(A[2] + (B[2] - A[2]) * t) + ")";
  }
  function eo(x) { x = Math.max(0, Math.min(1, x)); return 1 - Math.pow(1 - x, 3); }

  /* ---------- Flora (moody garden blooms) ---------- */
  function petalSprite(L, Wd, dpr, cBase, cMid, cTip) {
    var w = Math.ceil(Wd * 2.1 * dpr), h = Math.ceil(L * 1.04 * dpr);
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.translate(w / dpr / 2, h / dpr - 1);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-Wd * 0.95, -L * 0.18, -Wd * 0.9, -L * 0.9, -Wd * 0.2, -L * 0.985);
    g.quadraticCurveTo(0, -L * 0.9, Wd * 0.2, -L * 0.985);
    g.bezierCurveTo(Wd * 0.9, -L * 0.9, Wd * 0.95, -L * 0.18, 0, 0);
    g.closePath();
    var gr = g.createLinearGradient(0, 0, 0, -L);
    gr.addColorStop(0, cBase); gr.addColorStop(0.45, cMid); gr.addColorStop(1, cTip);
    g.fillStyle = gr; g.fill();
    g.save(); g.clip();
    g.strokeStyle = "rgba(21,16,20,0.3)"; g.lineWidth = 0.7;
    for (var k = -3; k <= 3; k++) {
      g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(k * Wd * 0.16, -L * 0.5, k * Wd * 0.27, -L * 0.95); g.stroke();
    }
    var sh = g.createLinearGradient(-Wd, 0, Wd, 0);
    sh.addColorStop(0, "rgba(255,244,238,0)"); sh.addColorStop(0.5, "rgba(255,244,238,0.16)"); sh.addColorStop(1, "rgba(255,244,238,0)");
    g.fillStyle = sh; g.fillRect(-Wd, -L, Wd * 2, L);
    g.restore();
    g.strokeStyle = "rgba(243,217,211,0.34)"; g.lineWidth = 0.8; g.stroke();
    return { c: c, w: w / dpr, h: h / dpr };
  }
  function leafSprite(L, Wd, dpr) {
    var w = Math.ceil(Wd * 2.2 * dpr), h = Math.ceil(L * 1.04 * dpr);
    var c = document.createElement("canvas"); c.width = w; c.height = h;
    var g = c.getContext("2d");
    g.scale(dpr, dpr);
    g.translate(w / dpr / 2, h / dpr - 1);
    g.beginPath();
    g.moveTo(0, 0);
    g.bezierCurveTo(-Wd * 1.1, -L * 0.25, -Wd * 0.8, -L * 0.8, 0, -L);
    g.bezierCurveTo(Wd * 0.8, -L * 0.8, Wd * 1.1, -L * 0.25, 0, 0);
    g.closePath();
    var gr = g.createLinearGradient(0, 0, 0, -L);
    gr.addColorStop(0, "#121712"); gr.addColorStop(0.5, "#293027"); gr.addColorStop(1, "#596050");
    g.fillStyle = gr; g.fill();
    g.strokeStyle = "rgba(204,194,160,0.32)"; g.lineWidth = 0.9;
    g.beginPath(); g.moveTo(0, -L * 0.04); g.quadraticCurveTo(Wd * 0.05, -L * 0.5, 0, -L * 0.94); g.stroke();
    g.strokeStyle = "rgba(204,194,160,0.14)"; g.lineWidth = 0.6;
    for (var i = 1; i < 6; i++) {
      var y = -L * (0.12 + i * 0.14);
      g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(-Wd * 0.4, y - L * 0.06, -Wd * 0.65 * (1 - i * 0.1), y - L * 0.14); g.stroke();
      g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(Wd * 0.4, y - L * 0.06, Wd * 0.65 * (1 - i * 0.1), y - L * 0.14); g.stroke();
    }
    return { c: c, w: w / dpr, h: h / dpr };
  }

  function Scene(canvas, cfg) {
    var ctx = canvas.getContext("2d");
    var dpr = 1, W = 0, H = 0, items = [], dust = [], raf = 0, t0 = 0, last = 0, running = false, ready = false;
    var RING_N = [8, 9, 9, 8, 7, 6];

    function layout() {
      var cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (!cw || !ch) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(ch * dpr);
      W = cw; H = ch;
      var base = Math.min(W, H * 1.15);
      items = [];
      (cfg.skipFlora ? [] : cfg.leaves).forEach(function (l) {
        var L = l.len * base;
        items.push({ type: "leaf", x: l.x * W, y: l.y * H, a: l.a, d: l.d, L: L, spr: leafSprite(L, L * 0.34, dpr) });
      });
      (cfg.skipFlora ? [] : cfg.blooms).forEach(function (b, bi) {
        var r = b.fr * base, rings = [];
        for (var i = 0; i < 6; i++) {
          var t = i / 5, Lr = r * (1 - 0.15 * i);
          rings.push({
            n: RING_N[i], off: i * 0.43 + bi * 0.7, Lr: Lr,
            spr: petalSprite(Lr, Lr * 0.58, dpr, FL.base, mix(FL.midOuter, FL.midInner, t), mix(FL.tipOuter, FL.tipInner, t))
          });
        }
        var dots = [];
        for (var k = 0; k < 18; k++) dots.push({ a: Math.random() * 6.283, rr: Math.random() * r * 0.09, ph: Math.random() * 6.283 });
        items.push({ type: "bloom", x: b.fx * W, y: b.fy * H, r: r, d: b.d, rings: rings, dots: dots });
      });
      dust = [];
      for (var n = 0; n < (cfg.dust || 0); n++) dust.push({ x: Math.random() * W, y: Math.random() * H, r: 0.6 + Math.random() * 1.7, vy: 5 + Math.random() * 14, ph: Math.random() * 6.283 });
      ready = true;
      return true;
    }

    function drawLeaf(it, t) {
      var p = eo((t - it.d) / 1.5);
      if (p <= 0) return;
      var a = it.a + Math.sin(t * 0.5 + it.x * 0.01) * 0.03;
      var cs = Math.cos(a) * dpr, sn = Math.sin(a) * dpr;
      ctx.setTransform(cs, sn, -sn, cs, it.x * dpr, it.y * dpr);
      ctx.globalAlpha = Math.min(1, p * 1.6);
      ctx.drawImage(it.spr.c, -it.spr.w / 2, -it.spr.h * p, it.spr.w, it.spr.h * p);
    }
    function drawBloom(b, t) {
      var tb = t - b.d;
      if (tb <= 0) return;
      for (var i = 0; i < b.rings.length; i++) {
        var rg = b.rings[i];
        var p = eo((tb - i * 0.16) / 1.7);
        if (p <= 0) continue;
        ctx.setTransform(dpr, 0, 0, dpr, b.x * dpr, b.y * dpr);
        var sg = ctx.createRadialGradient(0, 0, 0, 0, 0, rg.Lr * 0.95);
        sg.addColorStop(0, "rgba(14,12,15,0.62)"); sg.addColorStop(1, "rgba(14,12,15,0)");
        ctx.globalAlpha = p; ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(0, 0, rg.Lr * 0.95, 0, 6.283); ctx.fill();
        ctx.globalAlpha = Math.min(1, p * 1.8);
        for (var k = 0; k < rg.n; k++) {
          var a = rg.off + k * (6.2832 / rg.n) + Math.sin(t * 0.7 + i * 0.9 + k) * 0.025 * p + (1 - p) * 0.5;
          var cs = Math.cos(a) * dpr, sn = Math.sin(a) * dpr;
          ctx.setTransform(cs, sn, -sn, cs, b.x * dpr, b.y * dpr);
          var sx = 0.7 + 0.3 * p, sy = p * (1 + 0.012 * Math.sin(t * 0.9 + k));
          ctx.drawImage(rg.spr.c, -rg.spr.w * sx / 2, -rg.spr.h * sy, rg.spr.w * sx, rg.spr.h * sy);
        }
      }
      if (tb > 1.7) {
        ctx.setTransform(dpr, 0, 0, dpr, b.x * dpr, b.y * dpr);
        b.dots.forEach(function (d) {
          ctx.globalAlpha = 0.45 + 0.5 * Math.abs(Math.sin(t * 1.3 + d.ph));
          ctx.fillStyle = FL.dust;
          ctx.beginPath(); ctx.arc(Math.cos(d.a) * d.rr, Math.sin(d.a) * d.rr, 1.5, 0, 6.283); ctx.fill();
        });
      }
    }
    function drawDust(t, dt) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      for (var i = 0; i < dust.length; i++) {
        var d = dust[i];
        d.y -= d.vy * dt; d.x += Math.sin(t * 0.5 + d.ph) * 0.18;
        if (d.y < -4) { d.y = H + 4; d.x = Math.random() * W; }
        ctx.globalAlpha = 0.2 + 0.6 * Math.abs(Math.sin(t * 1.1 + d.ph));
        ctx.fillStyle = FL.dust;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
    }
    function frame(now) {
      var t = (now - t0) / 1000, dt = Math.min(0.05, (now - last) / 1000); last = now;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < items.length; i++) { if (items[i].type === "leaf") drawLeaf(items[i], t); else drawBloom(items[i], t); }
      drawDust(t, dt);
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(frame);
    }
    this.start = function () {
      if (!ready && !layout()) return;
      cancelAnimationFrame(raf);
      last = performance.now();
      if (reduce) { t0 = last - 20000; running = false; frame(last); return; }
      t0 = last; running = true; raf = requestAnimationFrame(frame);
    };
    this.resume = function () { if (reduce || running || !ready) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); };
    this.stop = function () { running = false; cancelAnimationFrame(raf); };
    this.relayout = function () { if (layout() && !running) { last = performance.now(); frame(last); } };
  }


  var coverScene = { stop: function () {} };

  /* ---------- Music ---------- */
  var Music = (function () {
    var ac = null, master = null, fx = null, on = false, timers = [], ci = 0, el = null;
    var CH = [[146.83, 220.0, 293.66, 369.99], [110.0, 220.0, 277.18, 329.63], [123.47, 185.0, 246.94, 293.66], [98.0, 196.0, 246.94, 293.66]];
    var BELL = [587.33, 659.25, 739.99, 880.0, 987.77, 1174.66];
    function setup() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      ac = new AC();
      master = ac.createGain(); master.gain.value = 0; master.connect(ac.destination);
      var d = ac.createDelay(1.0); d.delayTime.value = 0.42;
      var fb = ac.createGain(); fb.gain.value = 0.38;
      var lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1800;
      d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(master);
      fx = ac.createGain(); fx.gain.value = 0.5; fx.connect(d);
      return true;
    }
    function pad(freq, t, dur) {
      var o1 = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o1.type = "triangle"; o2.type = "sine"; o1.frequency.value = freq; o2.frequency.value = freq * 1.003;
      f.type = "lowpass"; f.frequency.value = 900;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.05, t + 2.2); g.gain.linearRampToValueAtTime(0.0001, t + dur + 2.5);
      o1.connect(f); o2.connect(f); f.connect(g); g.connect(master); g.connect(fx);
      o1.start(t); o2.start(t); o1.stop(t + dur + 2.6); o2.stop(t + dur + 2.6);
    }
    function bell(freq, t) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = "sine"; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 3);
      o.connect(g); g.connect(master); g.connect(fx); o.start(t); o.stop(t + 3.1);
    }
    function chordLoop() {
      if (!on) return;
      var t = ac.currentTime + 0.05;
      CH[ci % CH.length].forEach(function (f, i) { pad(f, t + i * 0.25, 6); });
      ci++;
      timers.push(setTimeout(chordLoop, 6000));
    }
    function bellLoop() {
      if (!on) return;
      bell(BELL[Math.floor(Math.random() * BELL.length)], ac.currentTime + 0.05);
      timers.push(setTimeout(bellLoop, 1400 + Math.random() * 2200));
    }
    function start() {
      on = true;
      if (CFG.music.src) {
        if (!el) { el = new Audio(CFG.music.src); el.loop = true; el.volume = CFG.music.volume; }
        var pr = el.play(); if (pr && pr.catch) pr.catch(function () { on = false; ui(); });
        return;
      }
      if (!ac && !setup()) { on = false; return; }
      if (ac.resume) ac.resume();
      master.gain.setTargetAtTime(0.55, ac.currentTime, 0.8);
      chordLoop(); timers.push(setTimeout(bellLoop, 2500));
    }
    function stop() {
      on = false;
      timers.forEach(clearTimeout); timers = [];
      if (el) { el.pause(); return; }
      if (ac) {
        master.gain.setTargetAtTime(0, ac.currentTime, 0.25);
        setTimeout(function () { if (!on && ac.suspend) ac.suspend(); }, 900);
      }
    }
    return { start: start, stop: stop, isOn: function () { return on; } };
  })();
  var musicBtn = $("tab-music");
  function ui() { if (!musicBtn) return; musicBtn.classList.toggle("playing", Music.isOn()); musicBtn.setAttribute("aria-pressed", Music.isOn() ? "true" : "false"); }
  if (musicBtn) musicBtn.addEventListener("click", function () { if (Music.isOn()) Music.stop(); else Music.start(); ui(); });


  /* ---------- Opening screen ---------- */
  var cover = $("cover");
  root.classList.add("locked");
  $("open-btn").focus({ preventScroll: true });
  function startFlowers() {
    var els = document.querySelectorAll(".fc"); if (!els.length) return;
    if (!("IntersectionObserver" in window) || reduce) { Array.prototype.forEach.call(els, function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }
  var opening = false;
  function openCover(withMusic) {
    if (withMusic && CFG.music.autoplayOnOpen !== false && musicBtn) { Music.start(); ui(); }
    root.classList.remove("locked");
    if (opening) return; opening = true;
    /* 1) the seal peels off like a sticker, 2) the doors open like an envelope */
    var PEEL = reduce ? 0 : 1150;
    if (!reduce) cover.classList.add("is-peeling");
    setTimeout(function () { cover.classList.add("is-open"); }, PEEL);
    setTimeout(function () { cover.hidden = true; }, PEEL + (reduce ? 0 : 1700));
    window.scrollTo(0, 0);
    setTimeout(startFlowers, PEEL + (reduce ? 0 : 700));
  }
  $("open-btn").addEventListener("click", function () { openCover(true); });
  if ($("open-quiet")) $("open-quiet").addEventListener("click", function () { openCover(false); });

  /* ---------- Reveal on scroll (below-the-fold content only) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduce) {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); rio.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) { el.classList.add("pre"); rio.observe(el); }
    });
  }

  /* ---------- Flower band parallax ---------- */
  (function () {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!HAS_FLORA || reduce) return;
    var bands = document.querySelectorAll(".flora-band");
    if (!bands.length) return;
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || 1;
      bands.forEach(function (b) {
        var r = b.getBoundingClientRect();
        var ratio = (r.top + r.height / 2 - vh / 2) / vh;
        var v = Math.max(-3, Math.min(3, -ratio * 4));
        b.style.setProperty("--shift", v.toFixed(2));
      });
    }
    function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", req, { passive: true });
    window.addEventListener("resize", req);
    update();
  })();

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll("a.tab"));
  tabs.forEach(function (t) {
    t.addEventListener("click", function (e) {
      e.preventDefault();
      closeSheet();
      var el = $(t.getAttribute("data-target"));
      if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });
  var lastSection = "utama";
  function setActive(id) {
    lastSection = id;
    if (openSheetId) return;
    tabs.forEach(function (t) { if (t.getAttribute("data-target") === id) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current"); });
  }
  if ("IntersectionObserver" in window) {
    var sio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    ["utama", "rsvp"].forEach(function (id) { if ($(id)) sio.observe($(id)); });
  }


  /* ---------- Pop-up panels: Location and Contact ---------- */
  var tabbar = document.querySelector(".tabbar");
  var backdrop = $("sheet-backdrop"), openSheetId = null;
  var sheetTabs = Array.prototype.slice.call(document.querySelectorAll(".tab[data-sheet]"));
  function setNavH() { root.style.setProperty("--nav-h", tabbar.offsetHeight + "px"); }
  setNavH();
  window.addEventListener("resize", setNavH);
  if ("ResizeObserver" in window) new ResizeObserver(setNavH).observe(tabbar);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setNavH);

  function closeSheet() {
    if (!openSheetId) return;
    var p = $(openSheetId);
    p.classList.remove("open"); p.setAttribute("aria-hidden", "true");
    backdrop.classList.remove("show");
    sheetTabs.forEach(function (t) { t.setAttribute("aria-expanded", "false"); t.removeAttribute("aria-current"); });
    openSheetId = null;
    setActive(lastSection);
  }
  function openSheet(id) {
    if (openSheetId === id) { closeSheet(); return; }
    closeSheet();
    var p = $(id); if (!p) return;
    setNavH();
    p.classList.add("open"); p.setAttribute("aria-hidden", "false");
    backdrop.classList.add("show");
    tabs.forEach(function (t) { t.removeAttribute("aria-current"); });
    sheetTabs.forEach(function (t) {
      var on = t.getAttribute("data-sheet") === id;
      t.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) t.setAttribute("aria-current", "true"); else t.removeAttribute("aria-current");
    });
    openSheetId = id;
    var cb = p.querySelector("[data-close]"); if (cb) cb.focus({ preventScroll: true });
  }
  sheetTabs.forEach(function (t) { t.addEventListener("click", function () { openSheet(t.getAttribute("data-sheet")); }); });
  Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (b) { b.addEventListener("click", closeSheet); });
  backdrop.addEventListener("click", closeSheet);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeSheet(); });

  /* ---------- Calendar ---------- */
  (function () {
    var g = $("cal-grid"); if (!g) return;
    CFG.text.calendar.weekdays.forEach(function (d) {
      var s = document.createElement("div"); s.className = "dow"; s.textContent = d; g.appendChild(s);
    });
    var first = new Date(E.year, E.month - 1, 1).getDay(), days = new Date(E.year, E.month, 0).getDate();
    for (var i = 0; i < first; i++) g.appendChild(document.createElement("div"));
    for (var d = 1; d <= days; d++) {
      var c = document.createElement("div"); c.className = "d" + (d === E.day ? " hit" : ""); c.textContent = String(d);
      if (d === E.day) c.setAttribute("aria-label", T("calendar.note"));
      g.appendChild(c);
    }
    g.setAttribute("aria-label", T("calendar.monthTitle"));
  })();

  /* ---------- Calendar and map links ---------- */
  (function () {
    function ymd(d) { return d.getFullYear() + p2(d.getMonth() + 1) + p2(d.getDate()); }
    function ymdhm(d) { return ymd(d) + "T" + p2(d.getHours()) + p2(d.getMinutes()) + "00"; }
    var title = T("calendar.eventTitle");
    var loc = E.venue + (E.address && E.address.charAt(0) !== "[" ? ", " + E.address : "");
    var dates, ctz = "";
    if (E.startTime) {
      var hm = E.startTime.split(":"), s = new Date(E.year, E.month - 1, E.day, +hm[0], +hm[1] || 0), en;
      if (E.endTime) { var eh = E.endTime.split(":"); en = new Date(E.year, E.month - 1, E.day, +eh[0], +eh[1] || 0); }
      else en = new Date(s.getTime() + 3 * 3600000);
      dates = ymdhm(s) + "/" + ymdhm(en);
      ctz = "&ctz=" + encodeURIComponent(E.timezone || "Asia/Kuala_Lumpur");
    } else {
      dates = ymd(dateObj) + "/" + ymd(new Date(E.year, E.month - 1, E.day + 1));
    }
    var cal = $("btn-cal");
    if (cal) cal.href = "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) + "&dates=" + dates + ctz + "&location=" + encodeURIComponent(loc);
    var q = encodeURIComponent(E.mapQuery || E.venue);
    if ($("btn-gmaps")) $("btn-gmaps").href = E.googleMapsUrl || ("https://www.google.com/maps/search/?api=1&query=" + q);
    if ($("btn-waze")) $("btn-waze").href = E.wazeUrl || ("https://waze.com/ul?q=" + q + "&navigate=yes");
  })();

  /* ---------- Countdown ---------- */
  (function () {
    var row = $("count-row"); if (!row) return;
    var done = $("count-done"), timer;
    var tm = (E.startTime || "00:00").split(":");
    var target = new Date(E.year, E.month - 1, E.day, +tm[0] || 0, +tm[1] || 0, 0).getTime();
    function pad(n) { return n < 10 ? "0" + n : String(n); }
    function tick() {
      var left = target - Date.now();
      if (left <= 0) {
        row.hidden = true; done.hidden = false;
        var same = Date.now() < target + 86400000;
        done.textContent = same ? T("calendar.today") : T("calendar.past");
        if (!same) clearInterval(timer);
        return;
      }
      var s = Math.floor(left / 1000);
      $("c-d").textContent = String(Math.floor(s / 86400));
      $("c-h").textContent = pad(Math.floor((s % 86400) / 3600));
      $("c-m").textContent = pad(Math.floor((s % 3600) / 60));
      $("c-s").textContent = pad(s % 60);
    }
    tick(); timer = setInterval(tick, 1000);
  })();

  /* ---------- Copy text ---------- */
  function copyText(text, btn, idle, doneLabel, selectEl) {
    function fallback() {
      if (selectEl) {
        var r = document.createRange(); r.selectNodeContents(selectEl);
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
      }
      btn.textContent = T("rsvp.selectManual");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = doneLabel;
        setTimeout(function () { btn.textContent = idle; }, 2000);
      }, fallback);
    } else { fallback(); }
  }

  /* ---------- Contacts ---------- */
  (function () {
    var wrap = $("contacts"); if (!wrap) return;
    var SVG = "http://www.w3.org/2000/svg";
    var WA = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 5a19 19 0 0 0-16.4 28.6L5 43l9.7-2.5A19 19 0 1 0 24 5z"/><path class="solid" d="M17.2 15.3c-1 1-1.4 2.7-.7 4.5 1.5 3.7 4.5 6.9 8.3 8.6 1.7.7 3.200.4 4.100-.6l.8-1.100a1 1 0 0 0-.2-1.300l-2.800-2a1 1 0 0 0-1.200 0l-1 .8c-1.600-.7-3.400-2.500-4.200-4.200l.9-1a1 1 0 0 0 .1-1.200l-1.900-2.900a1 1 0 0 0-1.400-.3z"/></svg>';
    var CALL = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 8c-2 2-2.600 5-1.300 8.200 3 7.400 8.600 13 16 16 3.200 1.300 6.200.7 8-1.300l1.600-2a2 2 0 0 0-.4-2.600l-5.400-3.800a2 2 0 0 0-2.400 0l-2 1.600c-3-1.400-6.600-5-8-8l1.800-2a2 2 0 0 0 .2-2.400L15 8.600A2 2 0 0 0 12 8z"/><path d="M31 10a10 10 0 0 1 7 7M31 4a16 16 0 0 1 13 13"/></svg>';
    CFG.contacts.forEach(function (c) {
      var name = fmt(c.name), role = fmt(c.role);
      var phone = normPhone(c.phone);
      var row = document.createElement("div"); row.className = "contact-row";
      var info = document.createElement("div"); info.className = "c-info";
      if (role) { var r = document.createElement("span"); r.className = "c-role"; r.textContent = role; info.appendChild(r); }
      var nm = document.createElement("span"); nm.className = "c-name"; nm.textContent = name; info.appendChild(nm);
      var ph = document.createElement("button"); ph.type = "button"; ph.className = "c-phone";
      if (phone) {
        ph.textContent = "+" + phone;
        ph.title = T("contact.copyButton");
        ph.addEventListener("click", function () { copyText("+" + phone, ph, "+" + phone, T("contact.copied"), ph); });
      } else { ph.className += " todo"; ph.disabled = true; ph.textContent = T("contact.phonePlaceholder"); }
      info.appendChild(ph);
      var act = document.createElement("div"); act.className = "c-actions";
      var wa = document.createElement("a"); wa.className = "c-btn"; wa.innerHTML = WA;
      wa.setAttribute("aria-label", T("contact.whatsappLabel", { name: name }));
      var call = document.createElement("a"); call.className = "c-btn"; call.innerHTML = CALL;
      call.setAttribute("aria-label", T("contact.callLabel", { name: name }));
      if (phone) {
        wa.href = "https://wa.me/" + phone; wa.target = "_blank"; wa.rel = "noopener";
        call.href = "tel:+" + phone;
      } else { wa.setAttribute("aria-disabled", "true"); call.setAttribute("aria-disabled", "true"); }
      act.appendChild(wa); act.appendChild(call);
      row.appendChild(info); row.appendChild(act); wrap.appendChild(row);
    });
  })();

  /* ---------- RSVP ---------- */
  (function () {
    var form = $("rsvp-form"); if (!form) return;
    var errEl = $("form-error"), wishesEl = $("guest-wishes");
    var guests = 1, maxG = CFG.rsvp.maxGuests || 10;
    var attendance = CFG.rsvp.attendance || {};
    var presentTotal = Number(attendance.present) || 0, absentTotal = Number(attendance.absent) || 0;
    var DB = CFG.supabase || {}, dbEnabled = !!(DB.url && DB.publishableKey);
    function renderGuests() { $("g-val").textContent = guests + " " + T("rsvp.guestsUnit"); }
    $("g-minus").addEventListener("click", function () { if (guests > 1) { guests--; renderGuests(); } });
    $("g-plus").addEventListener("click", function () { if (guests < maxG) { guests++; renderGuests(); } });
    renderGuests();
    function attendValue() { var r = form.querySelector('input[name="attend"]:checked'); return r ? r.value : "hadir"; }
    form.addEventListener("change", function () { $("guests-field").hidden = attendValue() === "tidak"; });

    function dbRequest(path, options) {
      var headers = { apikey: DB.publishableKey, Authorization: "Bearer " + DB.publishableKey };
      Object.keys((options && options.headers) || {}).forEach(function (key) { headers[key] = options.headers[key]; });
      return fetch(DB.url.replace(/\/$/, "") + "/rest/v1/" + path, {
        method: (options && options.method) || "GET", headers: headers, body: options && options.body
      }).then(function (response) {
        if (!response.ok) throw new Error("RSVP database request failed");
        var contentType = response.headers.get("content-type") || "";
        return contentType.indexOf("application/json") >= 0 ? response.json() : null;
      });
    }
    function saveRsvp(name, attending, note) {
      return dbRequest("rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ guest_name: name, attendance: attending ? "hadir" : "tidak", guest_count: attending ? guests : 0, wish: note || null })
      });
    }
    function loadAttendance() {
      return dbRequest("rpc/rsvp_totals", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" }).then(function (data) {
        var totals = data && data[0] ? data[0] : {};
        return { present: Number(totals.hadir) || 0, absent: Number(totals.tidak_hadir) || 0 };
      });
    }
    function loadWishes() {
      return dbRequest("rpc/rsvp_recent_wishes", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    }
    function renderWishes(wishes) {
      wishesEl.textContent = "";
      if (!wishes || !wishes.length) {
        var empty = document.createElement("p"); empty.className = "guestbook-empty"; empty.textContent = T("rsvp.guestbookEmpty"); wishesEl.appendChild(empty); return;
      }
      wishes.forEach(function (entry) {
        var article = document.createElement("article"); article.className = "guest-entry";
        var wish = document.createElement("p"); wish.className = "guest-wish"; wish.textContent = "\u201c" + entry.wish + "\u201d";
        var name = document.createElement("p"); name.className = "guest-name"; name.textContent = entry.guest_name;
        article.appendChild(wish); article.appendChild(name); wishesEl.appendChild(article);
      });
    }
    async function refreshGuestbook() {
      if (!dbEnabled) {
        $("attendance-yes").textContent = String(presentTotal);
        $("attendance-no").textContent = String(absentTotal);
        renderWishes([]); return;
      }
      var values = await Promise.all([loadAttendance(), loadWishes()]);
      $("attendance-yes").textContent = String(values[0].present);
      $("attendance-no").textContent = String(values[0].absent);
      renderWishes(values[1]);
    }
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (!$("name").value.trim()) { errEl.textContent = T("rsvp.errorName"); $("name").focus(); return; }
      errEl.textContent = "";
      var submitButton = form.querySelector('button[type="submit"]');
      var name = $("name").value.trim(), note = $("note").value.trim();
      var attending = attendValue() === "hadir";
      submitButton.disabled = true;
      try {
        if (dbEnabled) await saveRsvp(name, attending, note);
        else { presentTotal += attending ? guests : 0; absentTotal += attending ? 0 : 1; }
        await refreshGuestbook();
        form.reset(); guests = 1; renderGuests(); $("guests-field").hidden = false;
        $("guestbook").scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      } catch (error) {
        errEl.textContent = T("rsvp.errorSubmit");
      } finally {
        submitButton.disabled = false;
      }
    });
    refreshGuestbook().catch(function () { renderWishes([]); });
    if (dbEnabled) window.setInterval(function () { refreshGuestbook().catch(function () {}); }, 20000);
  })();
})();