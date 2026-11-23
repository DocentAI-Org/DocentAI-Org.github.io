(function () {
  "use strict";
  var C = window.DOCENTAI;
  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var $$ = function (sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var icon = function (id, cls) {
    return '<svg class="' + (cls || "icon-sm") + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
  };

  /* ---------- Language ---------- */
  var EN = {};
  $$("[data-i18n]").forEach(function (el) { EN[el.getAttribute("data-i18n")] = el.innerHTML; });
  $$("[data-i18n-attr]").forEach(function (el) {
    var parts = el.getAttribute("data-i18n-attr").split(":");
    EN[parts[1]] = el.getAttribute(parts[0]);
  });
  EN["theme.light"] = "Theme: light";
  EN["theme.dark"] = "Theme: dark";
  EN["video.player"] = "DocentAI presentation video";
  var lang = root.getAttribute("lang") === "es" ? "es" : "en";
  var t = function (key) { return (lang === "es" ? C.ES[key] : EN[key]) || EN[key] || ""; };
  var ui = function () { return C.UI[lang]; };

  function applyLang() {
    root.setAttribute("lang", lang);
    $$("[data-i18n]").forEach(function (el) {
      var v = t(el.getAttribute("data-i18n"));
      if (v && el.innerHTML !== v) el.innerHTML = v;
    });
    $$("[data-i18n-attr]").forEach(function (el) {
      var parts = el.getAttribute("data-i18n-attr").split(":");
      el.setAttribute(parts[0], t(parts[1]));
    });
    $("#lang-current").textContent = langNames[lang];
    langButton.setAttribute("aria-label", t("lang.label") + ": " + langNames[lang]);
    langOptions.forEach(function (o) { o.setAttribute("aria-selected", String(o.getAttribute("data-value") === lang)); });
    document.title = lang === "en" ? "DocentAI · A teacher-guided AI tutor" : "DocentAI · Tutor de IA guiado por el profesor";
    updateThemeButton();
    renderDemo(false);
    renderPolicy();
    renderAttempt();
  }
  /* ---------- Language menu: a button and a listbox, drawn by the page so it looks the same
     everywhere. Arrows, Home and End move, Enter or Space choose, Escape and Tab close. ---------- */
  var langNames = { es: "Español", en: "English" };
  var langButton = $("#lang-button"), langList = $("#lang-list");
  var langOptions = $$("[role='option']", langList), langActive = 0;

  function setLangActive(i) {
    langActive = (i + langOptions.length) % langOptions.length;
    langOptions.forEach(function (o, k) { o.classList.toggle("is-active", k === langActive); });
    langList.setAttribute("aria-activedescendant", langOptions[langActive].id);
  }
  function openLang() {
    langList.hidden = false;
    langButton.setAttribute("aria-expanded", "true");
    setLangActive(langOptions.map(function (o) { return o.getAttribute("data-value"); }).indexOf(lang));
    langList.focus();
  }
  function closeLang(focusButton) {
    if (langList.hidden) return;
    langList.hidden = true;
    langButton.setAttribute("aria-expanded", "false");
    if (focusButton) langButton.focus();
  }
  function chooseLang(value) {
    closeLang(true);
    if (value === lang) return;
    lang = value === "en" ? "en" : "es";
    store.set("docentai-lang", lang);
    applyLang();
  }
  langButton.addEventListener("click", function () { if (langList.hidden) openLang(); else closeLang(true); });
  langButton.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); openLang(); }
  });
  langList.addEventListener("keydown", function (e) {
    var keys = { ArrowDown: langActive + 1, ArrowUp: langActive - 1, Home: 0, End: langOptions.length - 1 };
    if (e.key in keys) { e.preventDefault(); setLangActive(keys[e.key]); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); chooseLang(langOptions[langActive].getAttribute("data-value")); }
    else if (e.key === "Escape") { e.preventDefault(); closeLang(true); }
    else if (e.key === "Tab") closeLang(false);
  });
  langList.addEventListener("click", function (e) {
    var o = e.target.closest("[role='option']");
    if (o) chooseLang(o.getAttribute("data-value"));
  });
  langList.addEventListener("mousemove", function (e) {
    var o = e.target.closest("[role='option']");
    if (o) setLangActive(langOptions.indexOf(o));
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("#lang-menu")) closeLang(false); });
  langList.addEventListener("focusout", function (e) {
    if (!e.relatedTarget || !e.relatedTarget.closest("#lang-menu")) closeLang(false);
  });

  /* ---------- Theme: system → light → dark ---------- */
  var themes = ["system", "light", "dark"];
  var themeIcons = { system: "monitor", light: "sun", dark: "moon" };
  function currentTheme() { return root.getAttribute("data-theme") || "system"; }
  function updateThemeButton() {
    var b = $("#theme-toggle"), th = currentTheme();
    b.setAttribute("aria-label", t("theme." + th));
    b.innerHTML = icon(themeIcons[th], "icon");
  }
  $("#theme-toggle").addEventListener("click", function () {
    var next = themes[(themes.indexOf(currentTheme()) + 1) % themes.length];
    if (next === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", next);
    store.set("docentai-theme", next);
    updateThemeButton();
  });

  /* ---------- Demo: the notebook you can ask ---------- */
  var demo = { subject: 0, question: 0, off: {}, left: 30, animate: false };

  function renderDemo(animate) {
    var s = C.SUBJECTS[demo.subject];
    $("#demo-course").textContent = s.course[lang];

    $("#subjects").innerHTML = C.SUBJECTS.map(function (x, i) {
      return '<button type="button" role="tab" id="tab-' + x.id + '" aria-selected="' + (i === demo.subject) +
        '" tabindex="' + (i === demo.subject ? 0 : -1) + '" data-subject="' + i + '">' + x.tab[lang] + "</button>";
    }).join("");

    $("#shelf").innerHTML = s.docs.map(function (d) {
      var on = !demo.off[d.id];
      return '<li class="doc' + (on ? "" : " is-off") + '">' + icon("file-text") +
        '<span class="doc-name">' + d.name + "<small>" + d.meta[lang] + " · " + (on ? ui().included : ui().excluded) + "</small></span>" +
        '<label class="switch"><input type="checkbox" data-doc="' + d.id + '"' + (on ? " checked" : "") +
        ' aria-label="' + ui().toggleDoc(d.name) + '"><span></span></label></li>';
    }).join("");

    var qs = $("#questions");
    $$(".q", qs).forEach(function (b) { b.remove(); });
    s.questions.forEach(function (q, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "q";
      b.setAttribute("data-q", i);
      b.setAttribute("aria-pressed", String(i === demo.question));
      b.textContent = q.q[lang];
      qs.appendChild(b);
    });

    var allowance = ui().allowance(demo.left);
    $("#allowance-text").textContent = allowance;
    $("#allowance-fill").style.width = (demo.left / 30) * 100 + "%";

    renderAnswer(animate);
  }

  function renderAnswer(animate) {
    var s = C.SUBJECTS[demo.subject];
    var q = s.questions[demo.question];
    var covered = q.doc && !demo.off[q.doc];
    var anim = animate && !reduceMotion;
    var delay = function (i) { return anim ? ' class="line-in" style="animation-delay:' + (250 + i * 260) + 'ms"' : ""; };

    var html = '<div class="student-line">' + q.q[lang] + "</div>";
    if (covered) {
      html += '<div class="tutor-answer"><div class="tutor-head"><span class="tag-ai">' + t("ai") + "</span>" + ui().tutor + "</div>" +
        q.a[lang].map(function (line, i) { return "<p" + delay(i) + ">" + line + "</p>"; }).join("") + "</div>";
    } else {
      html += '<div class="no-source' + (anim ? " line-in" : "") + '"' + (anim ? ' style="animation-delay:250ms"' : "") + "><h4>" +
        icon("info") + ui().noSourceTitle + "</h4><p>" + ui().noSourceBody + "</p></div>";
    }
    $("#thread").innerHTML = html;

    var margin = $("#demo-margin");
    margin.classList.toggle("is-empty", !covered);
    var mDelay = anim ? ' class="line-in" style="animation-delay:' + (300 + (covered ? q.a[lang].length : 1) * 260) + 'ms"' : "";
    margin.innerHTML = covered
      ? "<h3>" + ui().sourceTitle + "</h3><div" + mDelay + '><p class="cite"><strong>¹ ' + q.where[lang] + "</strong></p>" +
        "<blockquote class=\"cite\">" + q.quote[lang] + "</blockquote>" +
        '<p class="cite-validated">' + icon("check") + ui().validated + "</p></div>"
      : "<h3>" + ui().emptyTitle + "</h3><p class=\"empty-margin-text\">" + ui().emptyBody + "</p>";
  }

  $("#subjects").addEventListener("click", function (e) {
    var b = e.target.closest("[data-subject]");
    if (!b) return;
    demo.subject = +b.getAttribute("data-subject");
    demo.question = 0;
    renderDemo(true);
    $("#tab-" + C.SUBJECTS[demo.subject].id).focus();
  });
  $("#subjects").addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var n = C.SUBJECTS.length;
    demo.subject = (demo.subject + (e.key === "ArrowRight" ? 1 : n - 1)) % n;
    demo.question = 0;
    renderDemo(true);
    $("#tab-" + C.SUBJECTS[demo.subject].id).focus();
  });
  $("#questions").addEventListener("click", function (e) {
    var b = e.target.closest("[data-q]");
    if (!b) return;
    demo.question = +b.getAttribute("data-q");
    demo.left = Math.max(0, demo.left - 1);
    $$(".q").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
    $("#allowance-text").textContent = ui().allowance(demo.left);
    $("#allowance-fill").style.width = (demo.left / 30) * 100 + "%";
    renderAnswer(true);
  });
  $("#shelf").addEventListener("change", function (e) {
    var id = e.target.getAttribute("data-doc");
    if (!id) return;
    demo.off[id] = !e.target.checked;
    renderDemo(true);
    var again = $('#shelf input[data-doc="' + id + '"]');
    if (again) again.focus();
  });

  /* ---------- Hints before solutions ---------- */
  var policy = { mode: "hintsFirst", hints: 1, solved: false };

  function renderPolicy() {
    var P = C.POLICY, out = $("#policy-out");
    var steps = '<ol class="steps">' + P.steps[lang].map(function (s) { return "<li>" + s + "</li>"; }).join("") + "</ol>";
    var hint = function (h) { return '<div class="hint">' + icon("lightbulb", "icon") + "<p><strong>" + ui().hint + ".</strong> " + h + "</p></div>"; };
    var html = '<div class="tutor-answer"><div class="tutor-head"><span class="tag-ai">' + t("ai") + "</span>" + ui().tutor + "</div>";
    if (policy.mode === "direct") {
      html += steps;
    } else if (policy.mode === "hintsFirst") {
      html += hint(P.hints[lang][0]);
      html += policy.solved ? '<div style="margin-top:1rem">' + steps + "</div>"
        : '<div class="actions" style="margin-top:1rem"><button type="button" class="btn btn-secondary" data-act="solve">' + ui().seeSolution + "</button></div>";
    } else {
      html += P.hints[lang].slice(0, policy.hints).map(function (h, i) { return (i ? '<div style="margin-top:0.75rem">' : "<div>") + hint(h) + "</div>"; }).join("");
      html += policy.hints < P.hints[lang].length
        ? '<div class="actions" style="margin-top:1rem"><button type="button" class="btn btn-ghost" data-act="hint">' + ui().anotherHint + "</button></div>"
        : '<p class="policy-note" style="margin-top:1rem">' + ui().noMoreHints + "</p>";
    }
    html += "</div>";
    out.innerHTML = html;
    $$("#policy [data-mode]").forEach(function (b) {
      var on = b.getAttribute("data-mode") === policy.mode;
      b.setAttribute("aria-checked", String(on));
      b.tabIndex = on ? 0 : -1;
    });
  }
  function setPolicy(mode, focus) {
    policy = { mode: mode, hints: 1, solved: false };
    renderPolicy();
    if (focus) $('#policy [data-mode="' + mode + '"]').focus();
  }
  $("#policy").addEventListener("click", function (e) {
    var b = e.target.closest("[data-mode]");
    if (b) setPolicy(b.getAttribute("data-mode"), false);
  });
  $("#policy").addEventListener("keydown", function (e) {
    var modes = ["direct", "hintsFirst", "hintsOnly"];
    var i = modes.indexOf(policy.mode);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setPolicy(modes[(i + 1) % 3], true); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setPolicy(modes[(i + 2) % 3], true); }
  });
  $("#policy-out").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    if (b.getAttribute("data-act") === "solve") policy.solved = true; else policy.hints += 1;
    renderPolicy();
  });

  /* ---------- Recurring mistakes ---------- */
  var att = 0;
  function renderAttempt() {
    var A = C.ATTEMPTS, a = A[att];
    var fb = { wrong: ["is-wrong", "x"], repeat: ["is-repeat", "triangle-alert"], right: ["is-right", "check"] }[a.kind];
    $("#attempt").innerHTML =
      '<div class="attempt-head"><strong>' + ui().attempt(att + 1, A.length) + "</strong><span>" + a.day[lang] + "</span></div>" +
      '<div class="work"><div class="strip"><span class="label">' + ui().exercise + "</span>" + a.ex + "</div>" +
      '<div class="strip"><span class="label">' + ui().answerLabel + "</span>" + a.work + "</div></div>" +
      '<div class="feedback ' + fb[0] + '">' + icon(fb[1], "icon") + "<p>" + a.fb[lang] + "</p></div>";

    $("#tally-marks").innerHTML = new Array(a.marks + 1).join("<i></i>");
    var state = $("#tally-state");
    state.classList.toggle("is-over", a.kind === "right");
    state.innerHTML = a.kind === "right"
      ? icon("check") + "<span>" + ui().times(a.marks) + " · " + ui().overcome + "</span>"
      : ui().times(a.marks) + (a.kind === "repeat" ? " · " + ui().practice : "");

    $("#att-prev").disabled = att === 0;
    $("#att-next").disabled = att === A.length - 1;
    $$("#att-dots span").forEach(function (d, i) { d.classList.toggle("on", i <= att); });
  }
  $("#att-prev").addEventListener("click", function () { if (att > 0) { att--; renderAttempt(); } });
  $("#att-next").addEventListener("click", function () { if (att < C.ATTEMPTS.length - 1) { att++; renderAttempt(); } });

  /* ---------- Timeline: where today falls ---------- */
  (function () {
    // The milestones sit in equal columns, so today is placed within the column of the milestone
    // it falls after, not on a calendar scale.
    var items = $$("#tl-list .tl-item");
    var day = function (it, attr) { return new Date(it.getAttribute(attr)).getTime(); };
    var now = Date.now(), n = items.length, p = 0;
    items.forEach(function (it, i) {
      var s = day(it, "data-start");
      var next = i < n - 1 ? day(items[i + 1], "data-start") : day(it, "data-end") + 864e5;
      if (now >= s) p = (i + Math.min(1, (now - s) / (next - s))) / n;
    });
    $("#tl").style.setProperty("--progress", (p * 100).toFixed(1) + "%");
    items.forEach(function (it) {
      var s = new Date(it.getAttribute("data-start")).getTime();
      var e = new Date(it.getAttribute("data-end")).getTime() + 864e5;
      it.classList.toggle("is-past", now >= e);
      it.classList.toggle("is-now", now >= s && now < e);
    });
  })();

  /* ---------- Sections: fade in, glide between them, mark the index ---------- */
  var sections = $$("main > section");
  if ("IntersectionObserver" in window) {
    // The first time a section comes into view its blocks fade in and its bars grow.
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        seen.unobserve(en.target);
        en.target.classList.remove("is-hidden");
        en.target.classList.add("is-seen");
      });
    }, { threshold: 0.15 });
    sections.forEach(function (s) {
      if (!reduceMotion) s.classList.add("is-hidden");
      seen.observe(s);
      // Keyboard focus can reach a section before it scrolls into view: show it at once.
      s.addEventListener("focusin", function () {
        seen.unobserve(s);
        s.classList.remove("is-hidden");
        s.classList.add("is-seen");
      });
    });

    var links = $$(".side-nav__link");
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) {
          if (l.hash === "#" + en.target.id) l.setAttribute("aria-current", "location");
          else l.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  } else {
    sections.forEach(function (s) { s.classList.add("is-seen"); });
  }

  // The video: a local poster, swapped for YouTube's privacy-enhanced player on the first press.
  var play = $("#video-play");
  if (play) play.addEventListener("click", function (e) {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + play.getAttribute("data-youtube") + "?autoplay=1&rel=0";
    frame.title = t("video.player");
    frame.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    frame.allowFullscreen = true;
    var box = document.createElement("div");
    box.className = "video-frame";
    box.appendChild(frame);
    play.replaceWith(box);
    frame.focus();
  });

  // Desktop paging: each wheel gesture, arrow key or section link glides to the next section,
  // slower and softer than the browser's own snapping. Sections taller than the screen scroll
  // freely until their end.
  var desktop = window.matchMedia("(min-width: 900px)");
  // The footer shares the last screen with the last section (see .band:last-child).
  var footer = $(".footer");
  var setFooterHeight = function () { root.style.setProperty("--footer-h", footer.offsetHeight + "px"); };
  setFooterHeight();
  window.addEventListener("resize", setFooterHeight);
  var stops = sections;
  if (!reduceMotion) {
    root.classList.add("is-paged");
    var DURATION = 900;
    var ease = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
    var gliding = false, gestureUsed = false, lastWheel = 0;

    var glideTo = function (target) {
      var from = window.scrollY, distance = target - from;
      if (Math.abs(distance) < 2) return;
      gliding = true;
      gestureUsed = true;
      var start = performance.now();
      var step = function (now) {
        var x = Math.min(1, (now - start) / DURATION);
        window.scrollTo(0, from + distance * ease(x));
        if (x < 1) requestAnimationFrame(step); else gliding = false;
      };
      requestAnimationFrame(step);
    };

    // Where to go from here in `dir` (1 down, -1 up), or null to let the browser scroll.
    var nextStop = function (dir) {
      var y = window.scrollY, vh = window.innerHeight;
      var tops = stops.map(function (el) { return el.getBoundingClientRect().top + y; });
      var i = 0;
      tops.forEach(function (top, k) { if (top <= y + 2) i = k; });
      var bottom = tops[i] + stops[i].offsetHeight;
      if (dir > 0) {
        if (y + vh < bottom - 2) return null;
        return i < stops.length - 1 ? Math.min(tops[i + 1], document.documentElement.scrollHeight - vh) : null;
      }
      if (y > tops[i] + 2) return stops[i].offsetHeight > vh + 2 ? null : tops[i];
      if (i === 0) return null;
      // Going up into a tall section lands on its end.
      return Math.max(tops[i - 1], tops[i] - vh);
    };

    window.addEventListener("wheel", function (e) {
      if (!desktop.matches || e.ctrlKey || !e.deltaY) return;
      var now = performance.now();
      if (now - lastWheel > 200) gestureUsed = false;
      lastWheel = now;
      if (gliding || gestureUsed) return e.preventDefault();
      var target = nextStop(Math.sign(e.deltaY));
      if (target === null) return;
      e.preventDefault();
      glideTo(target);
    }, { passive: false });

    window.addEventListener("keydown", function (e) {
      if (!desktop.matches || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest("a, button, input, textarea, select, iframe, [role='tab'], [role='radio'], [role='listbox']")) return;
      var dir = { ArrowDown: 1, PageDown: 1, " ": e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key];
      if (!dir) return;
      if (gliding) return e.preventDefault();
      var target = nextStop(dir);
      if (target === null) return;
      e.preventDefault();
      glideTo(target);
    });

    $$('a[href^="#"]').forEach(function (link) {
      var target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      link.addEventListener("click", function (e) {
        if (!desktop.matches) return;
        e.preventDefault();
        history.replaceState(null, "", link.hash);
        glideTo(target.getBoundingClientRect().top + window.scrollY);
        // Move focus too, as the browser would, so the skip link and the index work by keyboard.
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
  }

  applyLang();
})();
