(function () {
  var KEY = "lau-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  if (!btn) return;

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) {}

  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }

  if (saved === "light" || saved === "dark") apply(saved);

  btn.addEventListener("click", function () {
    var current = root.getAttribute("data-theme");
    if (current === "dark") { apply("light"); }
    else if (current === "light") { apply("dark"); }
    else {
      var prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      apply(prefersDark ? "light" : "dark");
    }
  });
})();
