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

  // Live PR stats via GitHub public API (graceful fallback to static numbers)
  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) { el.textContent = String(value); }
  }

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
        var unmerged = res[2].total_count || 0; // open + closed-not-merged
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

        root.setAttribute("data-pr-live", "1");
      })
      .catch(function () {
        // keep static fallback numbers; mark unavailable for diagnostics only
        root.setAttribute("data-pr-live", "0");
      });
  }

  syncPrStats();
})();
