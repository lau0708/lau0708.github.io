(function () {
  var root = document.documentElement;

  // Scroll reveal (opt-in so content stays visible without JS)
  root.classList.add("js-anim");
  var revealables = document.querySelectorAll(".frag, .card, .pr-row, .pulse-cell, .pagehead, .work");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  // Data center: honest timestamp
  var timeEl = document.getElementById("pulse-time");
  if (timeEl) {
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var now = new Date();
    timeEl.textContent =
      now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate()) +
      " " + pad(now.getHours()) + ":" + pad(now.getMinutes());
  }

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) { el.textContent = String(value); }
  }

  // Number roll animation for data center counters
  function rollNumber(el) {
    var target = parseInt(el.getAttribute("data-roll"), 10);
    if (isNaN(target)) { return; }
    var suffix = el.getAttribute("data-suffix") || "";
    var useSep = el.getAttribute("data-sep") === "true";
    var start = null;
    var dur = 1300;
    function fmt(n) {
      var body = useSep ? n.toLocaleString("en-US") : String(n);
      return body + suffix;
    }
    function step(ts) {
      if (start === null) { start = ts; }
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased));
      if (p < 1) { requestAnimationFrame(step); }
    }
    requestAnimationFrame(step);
  }

  var datacenterRevealed = false;
  function rollDataCenter() {
    var cells = document.querySelectorAll(".pulse-cell b[data-roll]");
    Array.prototype.forEach.call(cells, rollNumber);
  }
  var dcEl = document.getElementById("datacenter");
  if (dcEl && "IntersectionObserver" in window) {
    var dcIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          datacenterRevealed = true;
          rollDataCenter();
          dcIO.disconnect();
        }
      });
    }, { threshold: 0.35 });
    dcIO.observe(dcEl);
  } else {
    datacenterRevealed = true;
    rollDataCenter();
  }

  // Live PR stats via GitHub public API (graceful fallback to static numbers)
  function syncPrStats() {
    var base = "https://api.github.com/search/issues?per_page=1&q=";
    var query = function (state) {
      return fetch(base + encodeURIComponent("author:lau0708 type:pr " + state), {
        headers: { Accept: "application/vnd.github+json" }
      }).then(function (res) {
        if (!res.ok) { throw new Error("HTTP " + res.status); }
        return res.json();
      });
    };

    Promise.all([query("is:merged"), query("is:open"), query("is:unmerged")])
      .then(function (res) {
        var merged = res[0].total_count || 0;
        var open = res[1].total_count || 0;
        var unmerged = res[2].total_count || 0;
        var closedNotMerged = Math.max(0, unmerged - open);
        var total = merged + unmerged;

        setText("stat-pr-total", total);
        setText("stat-pr-total2", total);
        setText("stat-pr-total3", total);
        setText("stat-pr-merged", merged);
        setText("stat-pr-merged2", merged);
        setText("stat-pr-merged3", merged);
        setText("stat-pr-merged4", merged);
        setText("stat-pr-open", open);
        setText("stat-pr-closed", closedNotMerged);

        var prTotalEl = document.getElementById("stat-pr-total2");
        if (prTotalEl) {
          prTotalEl.setAttribute("data-roll", String(total));
          if (datacenterRevealed) { rollNumber(prTotalEl); }
        }

        root.setAttribute("data-pr-live", "1");
      })
      .catch(function () {
        root.setAttribute("data-pr-live", "0");
      });
  }

  // Latest public commit time (from user public events)
  function formatWhen(iso) {
    var d = new Date(iso);
    var diff = Date.now() - d.getTime();
    var mins = Math.floor(diff / 60000);
    if (mins < 1) { return "刚刚"; }
    if (mins < 60) { return mins + " 分钟前"; }
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) { return hrs + " 小时前"; }
    var days = Math.floor(hrs / 24);
    if (days < 30) { return days + " 天前"; }
    var pad2 = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }

  function syncLastCommit() {
    var el = document.getElementById("pulse-last-commit");
    if (!el) { return; }
    fetch("https://api.github.com/users/lau0708/events/public?per_page=30", {
      headers: { Accept: "application/vnd.github+json" }
    }).then(function (res) {
      if (!res.ok) { throw new Error("HTTP " + res.status); }
      return res.json();
    }).then(function (events) {
      var push = null;
      (events || []).forEach(function (e) {
        if (!push && e.type === "PushEvent" && e.created_at) { push = e; }
      });
      if (push) {
        el.textContent = formatWhen(push.created_at);
        el.setAttribute("title", push.created_at);
      } else {
        el.textContent = "暂无公开提交";
      }
    }).catch(function () {
      el.textContent = "github.com/lau0708";
    });
  }

  syncPrStats();
  syncLastCommit();
})();
