/* The Raspberry Collective — site scripts */

/* ---------- Mobile navigation ---------- */
(function () {
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();

/* ---------- Footer year ---------- */
(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---------- Live Substack feed ---------- */
(function () {
  var mount = document.getElementById("posts");
  if (!mount) return;

  var status = document.getElementById("feed-status");
  var SUBSTACK = "https://theraspberrycollective.substack.com";
  var FEED = SUBSTACK + "/feed";

  // Try multiple CORS-friendly fetch strategies in order.
  var strategies = [
    {
      // allorigins returns the raw XML
      url: "https://api.allorigins.win/raw?url=" + encodeURIComponent(FEED),
      parse: parseXml
    },
    {
      // rss2json returns JSON
      url: "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(FEED),
      parse: parseJson
    },
    {
      // allorigins JSON-wrapped fallback
      url: "https://api.allorigins.win/get?url=" + encodeURIComponent(FEED),
      parse: function (text) {
        var wrapper = JSON.parse(text);
        return parseXml(wrapper.contents);
      }
    }
  ];

  loadInOrder(0);

  function loadInOrder(i) {
    if (i >= strategies.length) { showError(); return; }
    var s = strategies[i];
    fetch(s.url)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.text();
      })
      .then(function (text) {
        var items = s.parse(text);
        if (!items || !items.length) throw new Error("No items");
        render(items);
      })
      .catch(function () { loadInOrder(i + 1); });
  }

  function parseJson(text) {
    var data = JSON.parse(text);
    if (!data.items) return [];
    return data.items.map(function (it) {
      return {
        title: it.title,
        link: it.link,
        date: it.pubDate,
        description: it.description || it.content || ""
      };
    });
  }

  function parseXml(xmlText) {
    var doc = new DOMParser().parseFromString(xmlText, "text/xml");
    var nodes = doc.querySelectorAll("item");
    var out = [];
    nodes.forEach(function (n) {
      out.push({
        title: text(n, "title"),
        link: text(n, "link"),
        date: text(n, "pubDate"),
        description: text(n, "description")
      });
    });
    return out;
  }

  function text(node, tag) {
    var el = node.querySelector(tag);
    return el ? el.textContent : "";
  }

  function render(items) {
    if (status) status.remove();
    mount.innerHTML = "";
    items.forEach(function (item) {
      var a = document.createElement("a");
      a.className = "post";
      a.href = item.link;
      a.target = "_blank";
      a.rel = "noopener";

      var date = document.createElement("div");
      date.className = "post__date";
      date.textContent = formatDate(item.date);

      var title = document.createElement("h3");
      title.className = "post__title";
      title.textContent = item.title;

      var excerpt = document.createElement("p");
      excerpt.className = "post__excerpt";
      excerpt.textContent = excerptFrom(item.description);

      var more = document.createElement("span");
      more.className = "post__more";
      more.textContent = "Read on Substack \u2192";

      a.appendChild(date);
      a.appendChild(title);
      a.appendChild(excerpt);
      a.appendChild(more);
      mount.appendChild(a);
    });
  }

  function excerptFrom(html) {
    var tmp = document.createElement("div");
    tmp.innerHTML = html;
    var plain = (tmp.textContent || "").replace(/\s+/g, " ").trim();
    return plain.length > 180 ? plain.slice(0, 180).trim() + "\u2026" : plain;
  }

  function formatDate(str) {
    var d = new Date(str);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  function showError() {
    if (!status) return;
    status.classList.add("is-error");
    status.innerHTML =
      '<p>The latest writing lives on Substack. We could not load it here just now \u2014 ' +
      'please read it directly.</p>' +
      '<p><a class="btn btn--primary" href="' + SUBSTACK +
      '" target="_blank" rel="noopener">Visit the Substack</a></p>';
  }
})();
