"use strict";

function cmplz_create_element(e, t) {
    e = document.createElement(e);
    return e.innerHtml = t, e
}

function cmplz_add_event(e, t, c) {
    document.addEventListener(e, e => {
        e.target.closest(t) && c(e)
    })
}

function cmplz_is_hidden(e) {
    return null === e.offsetParent
}

function cmplz_html_decode(e) {
    return (new DOMParser).parseFromString(e, "text/html").documentElement.textContent
}

function cmplzLoadConsentAreaContent(e, i) {
    document.querySelectorAll(".cmplz-consent-area.cmplz-placeholder").forEach(t => {
        let c = t.getAttribute("data-category"),
            n = t.getAttribute("data-service");
        var o = t.getAttribute("data-post_id"),
            a = t.getAttribute("data-block_id");
        if (e === c || i === n) {
            let e = new XMLHttpRequest;
            e.open("GET", complianz.url + "consent-area/" + o + "/" + a, !0), e.setRequestHeader("Content-type", "application/json"), e.send(), t.classList.remove("cmplz-placeholder"), e.onload = function() {
                t.innerHTML = JSON.parse(e.response), t.querySelectorAll("script").forEach(e => {
                    cmplz_run_script(e.innerHTML, c, n, "inline", e)
                })
            }
        }
    })
}
document.querySelectorAll(".cmplz-consent-area.cmplz-placeholder").forEach(e => {
        e.addEventListener("click", e => {
            let t = e.target;
            (t = t.classList.contains("cmplz-consent-area") ? t : e.target.closest(".cmplz-consent-area.cmplz-placeholder")) && (cmplz_set_service_consent(e = t.getAttribute("data-service"), !0), cmplzLoadConsentAreaContent(!1, e), cmplz_enable_category(null, e), cmplz_set_banner_status("dismissed"))
        }), document.addEventListener("cmplz_enable_category", function(e) {
            cmplzLoadConsentAreaContent(e.detail.category, e.detail.service)
        })
    }), document.addEventListener("cmplz_manage_consent_container_loaded", function(e) {
        var t, c = window.location.href; - 1 != c.indexOf("#") && (t = -1 != c.lastIndexOf("?") ? c.lastIndexOf("?") : void 0, c = c.substring(c.indexOf("#") + 1, t), t = document.getElementById(c)) && (c = t.getBoundingClientRect().top + window.pageYOffset - 200, window.scrollTo({
            top: c,
            behavior: "smooth"
        }))
    }), complianz.locale = complianz.locale + "&token=" + Math.random().toString(36).replace(/[^a-z]+/g, "").substr(0, 5),
    function() {
        function e(e, t) {
            t = t || {
                bubbles: !1,
                cancelable: !1,
                detail: void 0
            };
            var c = document.createEvent("CustomEvent");
            return c.initCustomEvent(e, t.bubbles, t.cancelable, t.detail), c
        }
        "function" != typeof window.CustomEvent && (e.prototype = window.Event.prototype, window.CustomEvent = e)
    }();
var cmplz_banner, cmplz_manage_consent_button, cmplzResizeTimer, cmplz_banner_container = document.getElementById("cmplz-cookiebanner-container"),
    cmplz_waiting_inline_scripts = [],
    cmplz_waiting_scripts = [],
    cmplz_fired_scripts = [],
    cmplz_placeholder_class_index = 0,
    cmplz_all_scripts_hook_fired = !1,
    cmplz_consent_stored_once = !1,
    cmplz_fired_category_events = ["functional"],
    cmplz_fired_service_events = [],
    cmplz_categories = ["functional", "preferences", "statistics", "marketing"];
window.cmplz_get_cookie = function(t) {
    if ("undefined" != typeof document) {
        t = complianz.prefix + t;
        var c = document.cookie.split(";");
        for (let e = 0; e < c.length; e++) {
            var n = c[e].trim();
            if (n.startsWith(t + "=")) return n.substring(t.length + 1)
        }
    }
    return ""
}, window.cmplz_set_cookie = function(e, t, c) {
    var n, o, a, i;
    "undefined" != typeof document && (c = void 0 === c || c, n = "https:" === window.location.protocol ? ";secure" : "", (o = new Date).setTime(o.getTime() + 24 * complianz.cookie_expiry * 60 * 60 * 1e3), o = ";expires=" + o.toGMTString(), a = 0 < (a = cmplz_get_cookie_domain()).length ? ";domain=" + a : "", c = c ? complianz.prefix : "", i = cmplz_get_cookie_path(), document.cookie = "" + c + e + `=${t};SameSite=Lax${n}${o}${a};path=` + i)
}, window.cmplz_in_array = function(e, t) {
    return t.includes(e)
}, window.cmplz_highest_accepted_category = function() {
    var t = cmplz_accepted_categories(),
        c = ["marketing", "statistics", "preferences"];
    for (let e = 0; e < c.length; e++)
        if (cmplz_in_array(c[e], t)) return c[e];
    return "functional"
};
const cmplz_set_category_as_body_class = () => {
        const c = document.body.classList;
        for (let e = c.length - 1; 0 <= e; e--) c[e].startsWith("cmplz-") && "cmplz-document" !== c[e] && c.remove(c[e]);
        var e = cmplz_accepted_categories(),
            e = (Object.values(e).forEach(e => {
                "string" == typeof e && c.add("cmplz-" + e)
            }), cmplz_get_all_service_consents()),
            e = (Object.entries(e).forEach(([e, t]) => {
                t && c.add("cmplz-" + e)
            }), c.add("cmplz-" + complianz.region, "cmplz-" + complianz.consenttype), new CustomEvent("cmplz_set_category_as_bodyclass"));
        document.dispatchEvent(e)
    },
    cmplz_append_css = e => {
        var t = document.head || document.getElementsByTagName("head")[0],
            c = document.createElement("style");
        c.setAttribute("type", "text/css"), c.appendChild(document.createTextNode(e)), t.appendChild(c)
    },
    cmplz_load_css = e => {
        var t = document.head || document.getElementsByTagName("head")[0],
            c = document.createElement("link");
        c.rel = "stylesheet", c.type = "text/css", c.href = e, t.appendChild(c)
    };

function cmplz_run_script(t, c, n, e, o) {
    var a = document.createElement("script");
    if ("inline" !== e ? a.src = t : ("string" != typeof t && (t = t.innerHTML), a.innerHTML = [t, "cmplzScriptLoaded();"].join("\n")), !cmplz_in_array(t, cmplz_fired_scripts)) {
        cmplzCopyAttributes(o, a);
        try {
            "inline" !== e ? a.onload = function() {
                cmplz_run_after_all_scripts(c, n), cmplz_maybe_run_waiting_scripts(t, c, n, o)
            } : window.cmplzScriptLoaded = function() {
                cmplz_run_after_all_scripts(c, n), cmplz_maybe_run_waiting_scripts(t, c, n, o)
            }, document.head.appendChild(a)
        } catch (e) {
            throw cmplz_run_after_all_scripts(c, n), "Something went wrong " + e + " while loading " + t
        }
    }
}

function cmplz_maybe_run_waiting_scripts(e, t, c, n) {
    var o = cmplz_get_waiting_script(cmplz_waiting_scripts, e),
        o = (o && cmplz_run_script(o, t, c, "src", n), cmplz_get_waiting_script(cmplz_waiting_inline_scripts, e));
    o && cmplz_run_script(o, t, c, "inline", n)
}
const cmplzLazyLoader = () => {
    var e = document.querySelectorAll(".cmplz-blocked-content-container");
    const t = new IntersectionObserver((e, n) => {
        e.forEach(e => {
            var t, c;
            e.isIntersecting && ((t = (e = e.target).getAttribute("data-placeholder-image")) && (c = e.getAttribute("data-placeholder_class_index"), cmplz_append_css(".cmplz-placeholder-" + c + " {background-image: url(" + t + ") !important;}"), cmplz_set_blocked_content_container_aspect_ratio(e, t, c)), n.unobserve(e))
        })
    });
    e.forEach(e => {
        t.observe(e)
    })
};

function cmplz_set_blocked_content_container() {
    document.querySelectorAll(".cmplz-image").forEach(e => {
        var t, c, n, o;
        e.classList.contains("cmplz-processed") || (e.classList.add("cmplz-processed"), t = e.getAttribute("data-service"), c = e.getAttribute("data-category"), (n = e.parentElement).classList.add("cmplz-blocked-content-container"), o = n.getAttribute("data-placeholder_class_index"), "lazy" === e.getAttribute("loading") && (e.removeAttribute("loading"), e.setAttribute("data-deferlazy", 1)), null == o && (cmplz_placeholder_class_index++, n.classList.add("cmplz-placeholder-" + cmplz_placeholder_class_index, "cmplz-blocked-content-container"), n.setAttribute("data-placeholder_class_index", cmplz_placeholder_class_index), cmplz_insert_placeholder_text(n, c, t)))
    }), document.querySelectorAll(".cmplz-placeholder-element").forEach(t => {
        if (!t.classList.contains("cmplz-processed")) {
            t.classList.add("cmplz-processed");
            var c = t.getAttribute("data-service"),
                n = t.getAttribute("data-category");
            let e;
            null === (e = t.classList.contains("cmplz-iframe") ? ("lazy" === t.getAttribute("loading") && (t.removeAttribute("loading"), t.setAttribute("data-deferlazy", 1)), t.parentElement) : t).getAttribute("data-placeholder_class_index") && (cmplz_placeholder_class_index++, e.classList.add("cmplz-placeholder-" + cmplz_placeholder_class_index, "cmplz-blocked-content-container"), e.setAttribute("data-placeholder_class_index", cmplz_placeholder_class_index), cmplz_insert_placeholder_text(e, n, c), n = t.getAttribute("data-placeholder-image")) && void 0 !== n && n.length && e.setAttribute("data-placeholder-image", n)
        }
    }), cmplzLazyLoader(), cmplz_has_consent("statistics") && cmplz_enable_category("statistics"), cmplz_has_consent("marketing") && cmplz_enable_category("marketing")
}

function cmplz_insert_placeholder_text(e, n, o) {
    if (!e.querySelector(".cmplz-blocked-content-notice")) {
        let t = complianz.placeholdertext;
        n = n || "marketing";
        let c;
        if (void 0 !== t) {
            if (1 == complianz.clean_cookies) {
                let e = o ? o.replace("-", " ") : "";
                e = e.charAt(0).toUpperCase() + e.slice(1), t = t.replace("{service}", e), (c = cmplz_create_element("div", t)).innerHTML = t, c.classList.add("cmplz-blocked-content-notice");
                var a = c.querySelector("button"),
                    a = (a.setAttribute("data-service", o), a.setAttribute("data-category", n), a.setAttribute("aria-label", complianz.aria_label.replace("{service}", e)), complianz.page_links[complianz.region]),
                    i = c.querySelector(".cmplz-links a");
                a && a.hasOwnProperty("cookie-statement") && (i.setAttribute("href", a["cookie-statement"].url), "{title}" === i.innerText) && (i.innerText = a["cookie-statement"].title)
            } else {
                i = cmplz_create_element("button", ""), a = complianz.categories.hasOwnProperty(n) ? complianz.categories[n] : "marketing";
                i.innerText = t.replace("{category}", a), i.classList.add("cmplz-blocked-content-notice", "cmplz-accept-category", "cmplz-accept-" + n), i.setAttribute("data-service", o), i.setAttribute("data-category", n), i.setAttribute("aria-label", complianz.aria_label.replace("{category}", n)), c = i
            }("VIDEO" !== e.tagName ? e : e.parentElement).appendChild(c)
        }
    }
}

function cmplz_set_blocked_content_container_aspect_ratio(t, c, n) {
    var e;
    null != t && ((e = new Image).addEventListener("load", function() {
        var e = this.naturalWidth || 1,
            e = this.naturalHeight * (t.clientWidth / e),
            e = -1 === c.indexOf("placeholder.jpg") ? "height:" + e + "px;" : "";
        cmplz_append_css(".cmplz-placeholder-" + n + " {" + e + "}")
    }), e.src = c)
}

function cmplz_has_blocked_scripts() {
    return 0 < document.querySelectorAll("script[data-category], script[data-service]").length
}

function cmplz_enable_category(o, a) {
    1 == complianz.tm_categories && "" !== o && cmplz_run_tm_event(o);
    var t = {},
        t = (t.category = o, t.categories = cmplz_accepted_categories(), t.region = complianz.region, new CustomEvent("cmplz_before_category", {
            detail: t
        }));
    if (document.dispatchEvent(t), a = void 0 !== a ? a : "do_not_match", "functional" !== (o = "" === o ? "do_not_match" : o)) {
        "marketing" === o && cmplz_set_integrations_cookies();
        let e;
        e = "do_not_match" !== a ? '.cmplz-blocked-content-notice [data-service="' + a + '"]' : 1 != complianz.clean_cookies ? ".cmplz-blocked-content-notice.cmplz-accept-" + o : '.cmplz-blocked-content-notice [data-category="' + o + '"]', document.querySelectorAll(e).forEach(e => {
            var t = e.getAttribute("data-service");
            e.parentNode.classList.contains("cmplz-blocked-content-notice") && (e = e.parentNode), cmplz_is_service_denied(t) || e.parentNode.removeChild(e)
        }), document.querySelectorAll('[data-category="' + o + '"], [data-service="' + a + '"]').forEach(t => {
            var e = t.getAttribute("data-service");
            if (!cmplz_is_service_denied(e) && "functional" !== t.getAttribute("data-category") && !t.classList.contains("cmplz-activated")) {
                var e = t.tagName;
                if ("LINK" === e) {
                    t.classList.add("cmplz-activated");
                    var c = t.getAttribute("data-href");
                    cmplz_load_css(c, o)
                } else if ("IMG" === e) {
                    t.classList.add("cmplz-activated");
                    c = t.getAttribute("data-src-cmplz");
                    t.setAttribute("src", c), t.getAttribute("data-deferlazy") && t.setAttribute("loading", "lazy"), cmplz_remove_placeholder(t)
                } else if ("IFRAME" === e) {
                    t.classList.add("cmplz-activated");
                    let e = t.getAttribute("data-src-cmplz");
                    c = t.getAttribute("data-cmplz-target") ? t.getAttribute("data-cmplz-target") : "src";
                    "1" === cmplz_get_url_parameter(t.getAttribute(c), "autoplay") && (e += "&autoplay=1"), t.getAttribute("data-deferlazy") && t.setAttribute("loading", "lazy"), t.addEventListener("load", () => {
                        cmplz_remove_placeholder(t)
                    }), t.setAttribute(c, e)
                } else t.classList.contains("cmplz-placeholder-element") && (t.classList.add("cmplz-activated"), e = t.getAttribute("data-placeholder_class_index"), t.classList.remove("cmplz-blocked-content-container", "cmplz-placeholder-" + e))
            }
        });
        t = document.querySelectorAll('script[data-category="' + o + '"], script[data-service="' + a + '"]');
        t.forEach(e => {
            var t = e.getAttribute("data-waitfor"),
                c = e.getAttribute("data-cmplz-src");
            t && (c ? cmplz_waiting_scripts[t] = c : 0 < e.innerText.length && (cmplz_waiting_inline_scripts[t] = e)), e.parentElement && e.parentElement.removeChild(e)
        }), t.forEach(e => {
            var t, c, n = e.getAttribute("type");
            !e.classList.contains("cmplz-activated") && n && "text/javascript" !== n && (e.classList.add("cmplz-activated"), (n = e.getAttribute("data-cmplz-src")) ? (e.removeAttribute("type"), cmplz_is_waiting_script(cmplz_waiting_scripts, n) || (e.getAttribute("data-post_scribe_id") ? (t = "#" + e.getAttribute("data-post_scribe_id"), (c = document.querySelector(t)) && (c.innerHtml(""), postscribe(t, "<script src=" + n + "><\/script>"))) : cmplz_run_script(n, o, a, "src", e))) : 0 < e.innerText.length && (cmplz_is_waiting_script(cmplz_waiting_inline_scripts, e.innerText) || cmplz_run_script(e.innerText, o, a, "inline", e)))
        }), cmplz_run_after_all_scripts(o, a)
    }
}

function cmplz_remove_placeholder(e) {
    var t, c = e.closest(".cmplz-blocked-content-container");
    c && (t = c.getAttribute("data-placeholder_class_index"), c.classList.remove("cmplz-blocked-content-container", "cmplz-placeholder-" + t)), e.classList.remove("cmplz-iframe-styles", "cmplz-iframe", "video-wrap")
}

function cmplz_get_waiting_script(e, t) {
    for (var c in e) {
        var n;
        if (e.hasOwnProperty(c))
            if (-1 !== t.indexOf(c)) return n = e[c], delete e[c], n
    }
    return !1
}

function cmplz_array_is_empty(e) {
    for (var t in e)
        if (e.hasOwnProperty(t)) return !1;
    return !0
}

function cmplz_is_waiting_script(t, c) {
    for (var n in t)
        if (t.hasOwnProperty(n)) {
            let e = t[n];
            if ("string" != typeof e && (e = e.innerText), -1 !== c.indexOf(e) || -1 !== e.indexOf(c)) return !0
        }
    return !1
}

function cmplz_run_after_all_scripts(e, t) {
    var c = "do_not_match" !== t && !cmplz_in_array(t, cmplz_fired_service_events),
        n = "do_not_match" !== e && !cmplz_in_array(e, cmplz_fired_category_events);
    (n || c) && (n && cmplz_fired_category_events.push(e), c && cmplz_fired_service_events.push(t), (n = {}).category = e, n.service = t, n.categories = cmplz_accepted_categories(), n.services = cmplz_get_all_service_consents(), n.region = complianz.region, c = new CustomEvent("cmplz_enable_category", {
        detail: n
    }), document.dispatchEvent(c)), !cmplz_all_scripts_hook_fired && cmplz_array_is_empty(cmplz_waiting_inline_scripts) && cmplz_array_is_empty(cmplz_waiting_scripts) && (n = new CustomEvent("cmplz_run_after_all_scripts", {
        detail: e,
        service: t
    }), document.dispatchEvent(n), cmplz_all_scripts_hook_fired = !0)
}
window.addEventListener("resize", function(e) {
    clearTimeout(cmplzResizeTimer), cmplzResizeTimer = setTimeout(cmplz_set_blocked_content_container, 500)
}, !0), 1 == complianz.block_ajax_content && setInterval(function() {
    cmplz_set_blocked_content_container()
}, 2e3);
var cmplz_fired_events = [];

function cmplz_run_tm_event(e) {
    -1 === cmplz_fired_events.indexOf(e) && (cmplz_fired_events.push(e), window.dataLayer = window.dataLayer || [], window.dataLayer.push({
        event: "cmplz_event_" + e
    }), e = new CustomEvent("cmplz_tag_manager_event", {
        detail: e
    }), document.dispatchEvent(e))
}

function cmplz_fire_before_categories_consent(e) {
    var t = {},
        e = (t.categories = e, t.region = complianz.region, new CustomEvent("cmplz_before_categories_consent", {
            detail: t
        }));
    document.dispatchEvent(e)
}

function cmplz_check_cookie_policy_id() {
    var e = cmplz_get_cookie("policy_id");
    e && parseInt(complianz.current_policy_id) !== parseInt(e) && (cmplz_deny_all(), cmplz_set_banner_status("show"), cmplz_clear_cookies("cmplz"))
}

function cmplz_do_not_track() {
    var e = "doNotTrack" in navigator && "1" === navigator.doNotTrack,
        t = "globalPrivacyControl" in navigator && navigator.globalPrivacyControl;
    return !(!complianz.do_not_track_enabled || !t && !e)
}

function cmplz_get_services_on_page() {
    let c = [];
    return document.querySelectorAll("[data-service]").forEach(e => {
        var t = e.getAttribute("data-service"),
            e = e.getAttribute("data-category"); - 1 == c.indexOf(t) && c.push({
            category: e,
            service: t
        })
    }), c
}

function cmplz_is_bot() {
    var e = new RegExp("(googlebot/|Googlebot-Mobile|Google-InspectionTool|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)", "i"),
        t = navigator.userAgent;
    return e.test(t)
}

function cmplz_is_speedbot() {
    var e = navigator.userAgent;
    return new RegExp("(GTmetrix|pingdom|pingbot|Lighthouse)", "i").test(e)
}

function cmplz_exists_service_consent() {
    var e, t = cmplz_get_cookie("consented_services");
    try {
        for (const c in e = JSON.parse(t))
            if (e.hasOwnProperty(c) && 1 == e[c]) return !0
    } catch (e) {}
    return !1
}

function cmplz_set_service_consent(e, t) {
    var c = cmplz_get_cookie("consented_services");
    let n;
    try {
        n = JSON.parse(c)
    } catch (e) {
        n = {}
    }
    n[e] = t, cmplz_set_cookie("consented_services", JSON.stringify(n));
    c = {}, c.service = e, c.value = t, c.region = complianz.region, cmplz_all_scripts_hook_fired = !1, e = new CustomEvent("cmplz_status_change_service", {
        detail: c
    });
    document.dispatchEvent(e)
}

function cmplz_clear_all_service_consents() {
    cmplz_set_cookie("consented_services", "")
}

function cmplz_get_all_service_consents() {
    var e = cmplz_get_cookie("consented_services");
    let t;
    try {
        t = JSON.parse(e)
    } catch (e) {
        t = {}
    }
    return t
}

function cmplz_get_cookie_path() {
    return void 0 !== complianz.cookie_path && "" !== complianz.cookie_path ? complianz.cookie_path : "/"
}

function cmplz_get_cookie_domain() {
    return 1 == complianz.set_cookies_on_root && 3 < complianz.cookie_domain.length && !complianz.cookie_domain.includes("localhost") ? complianz.cookie_domain : ""
}

function cmplz_reload_browser_compatible() {
    var e; - 1 < navigator.userAgent.toLowerCase().indexOf("firefox") ? ((e = new URL(window.location.href)).searchParams.set("cmplz-force-reload", Date.now().toString()), window.location.href = e.toString()) : window.location.reload()
}
window.cmplz_accept_all = function() {
    for (var e in cmplz_clear_all_service_consents(), cmplz_fire_before_categories_consent(cmplz_categories), cmplz_categories) cmplz_categories.hasOwnProperty(e) && cmplz_set_consent(cmplz_categories[e], "allow");
    cmplz_sync_category_checkboxes()
}, window.cmplz_deny_all = function() {
    for (var e in cmplz_categories) cmplz_categories.hasOwnProperty(e) && cmplz_set_consent(cmplz_categories[e], "deny");
    let t = !1;
    "functional" === cmplz_highest_accepted_category() && !cmplz_exists_service_consent() || (t = !0), cmplz_clear_cookies("cmplz_service") && (t = !0), cmplz_clear_all_service_consents(), cmplz_integrations_revoke(), cmplz_fire_categories_event(), cmplz_track_status();
    var c = new CustomEvent("cmplz_revoke", {
        detail: t
    });
    document.dispatchEvent(c), !complianz.tcf_active && t && cmplz_reload_browser_compatible()
}, window.conditionally_show_banner = function() {
    complianz = cmplz_merge_object(complianz, cmplz_user_data), cmplz_maybe_auto_redirect(), cmplz_set_blocked_content_container(), window.wp_consent_type = complianz.consenttype;
    var e, t, c, n = new CustomEvent("wp_consent_type_defined"),
        o = (document.dispatchEvent(n), n = new CustomEvent("cmplz_before_cookiebanner"), document.dispatchEvent(n), 1 == complianz.forceEnableStats && "optin" === complianz.consenttype && cmplz_set_consent("statistics", "allow"), cmplz_categories.reverse()),
        a = [];
    for (e in o) o.hasOwnProperty(e) && (t = cmplz_categories[e], cmplz_has_consent(t)) && a.push(t);
    for (c in cmplz_fire_before_categories_consent(a), a) o.hasOwnProperty(c) && cmplz_enable_category(a[c]);
    if (cmplz_exists_service_consent()) {
        cmplz_enable_category("", "general");
        var i, l, r, s = cmplz_get_services_on_page();
        for (i in s) s.hasOwnProperty(i) && (l = s[i].service, r = s[i].category, cmplz_has_service_consent(l, r)) && (document.querySelectorAll('.cmplz-accept-service[data-service="' + l + '"]').forEach(e => {
            e.checked = !0
        }), cmplz_enable_category("", l))
    }
    cmplz_sync_category_checkboxes(), cmplz_integrations_init(), cmplz_check_cookie_policy_id(), cmplz_set_up_auto_dismiss(), cmplz_load_manage_consent_container(), n = new CustomEvent("cmplz_cookie_banner_data", {
        detail: complianz
    }), document.dispatchEvent(n), "" === cmplz_get_cookie("saved_categories") && ("optin" !== complianz.consenttype && "optout" !== complianz.consenttype ? cmplz_track_status("no_warning") : cmplz_do_not_track() && cmplz_track_status("do_not_track")), cmplz_set_category_as_body_class(), cmplz_fire_categories_event(), cmplz_do_not_track() ? (console.log("global privacy control or do not track detected: no banner."), cmplz_track_status("do_not_track")) : ("optin" === complianz.consenttype ? (complianz.forceEnableStats && cmplz_enable_category("statistics"), console.log("opt-in"), show_cookie_banner) : "optout" === complianz.consenttype ? (console.log("opt-out"), show_cookie_banner) : (console.log("other consent type, no cookie warning"), cmplz_accept_all))()
}, window.show_cookie_banner = function() {
    let e = complianz.disable_cookiebanner || cmplz_is_speedbot(),
        t = !1;
    (document.querySelector("#cmplz-manage-consent-container") || document.querySelector(".cmplz-dropdown-cookiepolicy")) && (t = !0);
    var c = document.getElementById("cmplz-cookiebanner-container"),
        c = (c && document.body.prepend(c), document.createElement("link"));
    let n = complianz.page_links[complianz.region];
    (cmplz_banner = document.querySelector(".cmplz-cookiebanner.banner-" + complianz.user_banner_id + "." + complianz.consenttype)) || (e = !0), cmplz_manage_consent_button = document.querySelector("#cmplz-manage-consent .cmplz-manage-consent.manage-consent-" + complianz.user_banner_id);
    var o = complianz.css_file.replace("{type}", complianz.consenttype).replace("{banner_id}", complianz.user_banner_id),
        o = (-1 !== complianz.css_file.indexOf("cookiebanner/css/defaults/banner") && console.log("Fallback default css file used. Please re-save banner settings, or check file writing permissions in uploads directory"), c.href = o, c.type = "text/css", c.rel = "stylesheet", c.onload = function() {
            e || (cmplz_banner.classList.remove("cmplz-hidden"), cmplz_manage_consent_button.classList.remove("cmplz-hidden"))
        }, document.getElementsByTagName("head")[0].appendChild(c), cmplz_banner && !e && (cmplz_banner.querySelectorAll(".cmplz-links a:not(.cmplz-external), .cmplz-buttons a:not(.cmplz-external)").forEach(e => {
            var t, c = e;
            for (t in c.classList.add("cmplz-hidden"), n) n.hasOwnProperty(t) && c.classList.contains(t) && (c.setAttribute("href", n[t].url + c.getAttribute("data-relative_url")), "{title}" === c.innerText && (c.innerText = cmplz_html_decode(n[t].title)), c.classList.remove("cmplz-hidden"))
        }), cmplz_set_banner_status(), t) && (cmplz_banner.classList.remove("cmplz-show"), cmplz_banner.classList.add("cmplz-dismissed"), cmplz_manage_consent_button.classList.remove("cmplz-dismissed"), cmplz_manage_consent_button.classList.add("cmplz-show")), new CustomEvent("cmplz_cookie_warning_loaded", {
            detail: complianz.region
        }));
    document.dispatchEvent(o)
}, window.cmplz_get_banner_status = function() {
    return cmplz_get_cookie("banner-status")
}, window.cmplz_set_banner_status = function(e) {
    let t = cmplz_get_cookie("banner-status");
    (e = void 0 !== e ? e : t) !== t && cmplz_set_cookie("banner-status", e), 0 === e.length && (e = "show"), t = "show" === e ? "dismissed" : "show", cmplz_banner && 0 < e.length && (cmplz_banner.classList.remove("cmplz-" + t), cmplz_banner.classList.add("cmplz-" + e), cmplz_manage_consent_button) && (cmplz_manage_consent_button.classList.add("cmplz-" + t), cmplz_manage_consent_button.classList.remove("cmplz-" + e)), cmplz_banner_container && complianz.soft_cookiewall && (cmplz_banner_container.classList.remove("cmplz-" + t), cmplz_banner_container.classList.add("cmplz-" + e, "cmplz-soft-cookiewall"));
    e = new CustomEvent("cmplz_banner_status", {
        detail: e
    });
    document.dispatchEvent(e), cmplz_start_clean()
}, window.cmplz_has_consent = function(e) {
    if (cmplz_is_bot()) return !0;
    if ("functional" === e) return !0;
    let t, c;
    return t = cmplz_do_not_track() ? (c = cmplz_get_cookie(e), "allow" === c) : (c = cmplz_get_cookie(e), ("optout" === complianz.consenttype || "other" === complianz.consenttype) && "" === c || "allow" === c)
}, window.cmplz_is_service_denied = function(e) {
    var t = cmplz_get_cookie("consented_services");
    let c;
    try {
        c = JSON.parse(t)
    } catch (e) {
        c = {}
    }
    return !!c.hasOwnProperty(e) && !c[e]
}, window.cmplz_has_service_consent = function(e, t) {
    var c = cmplz_get_cookie("consented_services");
    let n;
    try {
        n = JSON.parse(c)
    } catch (e) {
        n = {}
    }
    return n.hasOwnProperty(e) ? n[e] : cmplz_has_consent(t)
}, window.cmplz_set_consent = function(e, t) {
    cmplz_set_accepted_cookie_policy_id(), t = "functional" === e ? "allow" : t;
    var c, n = cmplz_get_cookie(e);
    let o = "allow" === t;
    document.querySelectorAll("input.cmplz-" + e).forEach(e => {
        e.checked = o
    }), n !== t && (cmplz_set_cookie(e, t), "allow" === t && cmplz_enable_category(e), cmplz_wp_set_consent(e, t), "statistics" === e && cmplz_wp_set_consent("statistics-anonymous", "allow"), (c = new Object).category = e, c.value = t, c.region = complianz.region, c.categories = cmplz_accepted_categories(), cmplz_all_scripts_hook_fired = !1, c = new CustomEvent("cmplz_status_change", {
        detail: c
    }), document.dispatchEvent(c), "marketing" === e) && "deny" === t && "allow" === n && (cmplz_integrations_revoke(), setTimeout(function() {
        cmplz_reload_browser_compatible()
    }, 500))
};
var cmplz_id_cookie, cmplz_id_session, cmplz_id, cmplz_user_data = [];
if ("undefined" != typeof Storage && sessionStorage.cmplz_user_data && (cmplz_user_data = JSON.parse(sessionStorage.cmplz_user_data)), 1 != complianz.geoip || 0 != cmplz_user_data.length && cmplz_user_data.version === complianz.version && cmplz_user_data.banner_version === complianz.banner_version) conditionally_show_banner();
else {
    let e = new XMLHttpRequest,
        t = cmplz_get_url_parameter(window.location.href, "cmplz_user_region");
    t = t ? "&cmplz_user_region=" + t : "", e.open("GET", complianz.url + "banner?" + complianz.locale + t, !0), e.setRequestHeader("Content-type", "application/json"), e.send(), e.onload = function() {
        cmplz_user_data = JSON.parse(e.response), sessionStorage.cmplz_user_data = JSON.stringify(cmplz_user_data), conditionally_show_banner()
    }
}

function cmplz_track_status_end() {
    cmplz_consent_stored_once || cmplz_track_status()
}

function cmplz_set_up_auto_dismiss() {
    if ("optout" === complianz.consenttype) {
        if (1 == complianz.dismiss_on_scroll) {
            let t = function(e) {
                window.pageYOffset > Math.floor(400) && (cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status(), window.removeEventListener("scroll", t), this.onWindowScroll = null)
            };
            window.addEventListener("scroll", t)
        }
        var e = parseInt(complianz.dismiss_timeout);
        0 < e && window.setTimeout(function() {
            cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status()
        }, Math.floor(e))
    }
}

function cmplz_fire_categories_event() {
    var e = new Object,
        e = (e.category = cmplz_highest_accepted_category(), e.categories = cmplz_accepted_categories(), e.region = complianz.region, new CustomEvent("cmplz_fire_categories", {
            detail: e
        }));
    document.dispatchEvent(e)
}

function cmplz_track_status(e) {
    let t = [];
    e = void 0 !== e && e;
    var c = new CustomEvent("cmplz_track_status", {
        detail: e
    });
    document.dispatchEvent(c), t = e ? [e] : cmplz_accepted_categories(), cmplz_set_category_as_body_class();
    let n, o;
    try {
        n = JSON.parse(cmplz_get_cookie("saved_categories"))
    } catch (e) {
        n = {}
    }
    try {
        o = JSON.parse(cmplz_get_cookie("saved_services"))
    } catch (e) {
        o = {}
    }
    var c = cmplz_get_all_service_consents();
    cmplz_equals(n, t) && cmplz_equals(o, c) || 1 != complianz.store_consent || cmplz_is_bot() || cmplz_is_speedbot() || (cmplz_set_cookie("saved_categories", JSON.stringify(t)), cmplz_set_cookie("saved_services", JSON.stringify(c)), cmplz_consent_stored_once = !0, (e = new XMLHttpRequest).open("POST", complianz.url + "track", !0), c = {
        consented_categories: t,
        consented_services: c,
        consenttype: window.wp_consent_type
    }, e.setRequestHeader("Content-type", "application/json"), e.send(JSON.stringify(c)))
}

function cmplz_accepted_categories() {
    let e = cmplz_categories,
        n = [];
    for (var t in e) e.hasOwnProperty(t) && (t = e[t], cmplz_has_consent(t)) && n.push(t);
    return e = e.filter(function(e, t, c) {
        return cmplz_in_array(e, n)
    })
}

function cmplz_sync_category_checkboxes() {
    for (var e in cmplz_categories) cmplz_categories.hasOwnProperty(e) && (e = cmplz_categories[e], cmplz_has_consent(e) || "functional" === e ? document.querySelectorAll("input.cmplz-" + e).forEach(e => {
        e.checked = !0
    }) : document.querySelectorAll("input.cmplz-" + e).forEach(e => {
        e.checked = !1
    })), document.querySelectorAll(".cmplz-accept-service").forEach(e => {
        var t = e.getAttribute("data-service"),
            c = e.getAttribute("data-category");
        cmplz_has_service_consent(t, c) ? e.checked = !0 : cmplz_is_service_denied(t) ? e.checked = !1 : (c = e.getAttribute("data-category"), e.checked = !!cmplz_has_consent(c))
    })
}

function cmplz_merge_object(e, t) {
    var c, n, o = {};
    for (c in t) t.hasOwnProperty(c) && (o[c] = t[c]);
    for (n in e) t.hasOwnProperty(n) && void 0 !== t[n] || e.hasOwnProperty(n) && (o[n] = e[n]);
    return o
}

function cmplz_clear_cookies(t) {
    if ("undefined" == typeof document) return !1;
    let a = !1,
        i = "https:" === window.location.protocol ? ";secure" : "",
        l = "expires=" + (new Date).toGMTString(),
        r = location.pathname.replace(/^\/|\/$/g, "").split("/");
    return document.cookie.split("; ").forEach(function(e) {
        let n = e.split(";")[0].split("=")[0];
        if (-1 !== n.indexOf(t)) {
            a = !0;
            let c = window.location.hostname.split(".");
            var o = 1 < c.length;
            for (r.forEach(function(e) {
                    e = "/" + e;
                    document.cookie = encodeURIComponent(n) + "=;SameSite=Lax" + i + ";" + l + ";domain=." + c.join(".") + ";path=" + e, document.cookie = encodeURIComponent(n) + "=;SameSite=Lax" + i + ";" + l + ";domain=." + c.join(".") + ";path=" + e + "/"
                }); 0 < c.length;) {
                let t = "." + c.join(".");
                c.shift(), o && 1 === c.length && c.shift(), r.forEach(function(e) {
                    e = "/" + e;
                    document.cookie = encodeURIComponent(n) + "=;SameSite=Lax" + i + ";" + l + ";domain=" + t + ";path=" + e, document.cookie = encodeURIComponent(n) + "=;SameSite=Lax" + i + ";" + l + ";domain=" + t + ";path=" + e + "/"
                })
            }
        }
    }), cmplz_set_accepted_cookie_policy_id(), a
}

function cmplz_set_accepted_cookie_policy_id() {
    cmplz_set_cookie("policy_id", complianz.current_policy_id)
}

function cmplz_integrations_init() {
    var e, t = complianz.set_cookies;
    for (e in t) t.hasOwnProperty(e) && "1" === t[e][1] && cmplz_set_cookie(e, t[e][1], !1)
}

function cmplz_integrations_revoke() {
    var e, t = complianz.set_cookies;
    for (e in t) t.hasOwnProperty(e) && (cmplz_set_cookie(e, t[e][1], !1), 0 == t[e][1]) && cmplz_clear_cookies(e)
}

function cmplz_set_integrations_cookies() {
    var e, t = complianz.set_cookies;
    for (e in t) t.hasOwnProperty(e) && cmplz_set_cookie(e, t[e][0], !1)
}

function cmplz_get_url_parameter(e, t) {
    if (e && void 0 !== e && -1 !== e.indexOf("?")) {
        e = e.split("?")[1];
        if (e) {
            var c = e.split("&");
            for (let e = 0; e < c.length; e++) {
                var n = c[e].split("=");
                if (n[0] === t) return void 0 === n[1] || decodeURIComponent(n[1])
            }
        }
    }
    return !1
}

function cmplz_maybe_auto_redirect() {
    var e = cmplz_get_url_parameter(window.location.href, "cmplz_region_redirect"),
        t = cmplz_get_url_parameter(window.location.href, "cmplz-region");
    e && !t && (e = window.location.href.split("#")[0] + "&cmplz-region=" + complianz.region, t = window.location.hash, window.location.href = e + t)
}

function cmplz_wp_set_consent(e, t) {
    "function" == typeof wp_set_consent && wp_set_consent(e, t)
}
1 == complianz.store_consent && (cmplz_id_cookie = cmplz_get_cookie("id"), cmplz_id = cmplz_id_session = "", "undefined" != typeof Storage && sessionStorage.cmplz_id && (cmplz_id_session = JSON.parse(sessionStorage.cmplz_id)), 0 == cmplz_id_cookie.length && 0 < cmplz_id_session.length && (cmplz_id = cmplz_id_session, cmplz_set_cookie("id", cmplz_id)), 0 < cmplz_id_cookie.length && 0 == cmplz_id_session.length && (cmplz_id = cmplz_id_cookie), "undefined" != typeof Storage) && (sessionStorage.cmplz_id = JSON.stringify(cmplz_id)), document.addEventListener("visibilitychange", function() {
    "hidden" === document.visibilityState && cmplz_track_status_end()
}), window.addEventListener("pagehide", cmplz_track_status_end, !1), window.addEventListener("beforeunload", cmplz_track_status_end, !1), document.addEventListener("cmplz_consent_action", function(e) {
    cmplz_set_consent(e.detail.category, "allow"), cmplz_fire_categories_event(), cmplz_track_status()
}), cmplz_add_event("click", ".cmplz-accept", function(e) {
    e.preventDefault(), setTimeout(() => {
        cmplz_accept_all(), cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status()
    }, 0)
}), cmplz_add_event("click", ".cmplz-accept-category, .cmplz-accept-marketing", function(e) {
    e.preventDefault();
    var e = e.target,
        t = e.getAttribute("data-service"),
        e = e.getAttribute("data-category") || "marketing";
    1 == complianz.clean_cookies && void 0 !== t && t ? (cmplz_set_service_consent(t, !0), cmplz_enable_category("", "general"), cmplz_enable_category("", t)) : cmplz_set_consent(e, "allow"), cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status()
}), cmplz_add_event("click", ".cmplz-accept-service", function(e) {
    var e = e.target;
    "INPUT" !== e.tagName && (void 0 !== (e = e.getAttribute("data-service")) && (cmplz_set_service_consent(e, !0), cmplz_enable_category("", "general"), cmplz_enable_category("", e)), cmplz_fire_categories_event(), cmplz_track_status())
}), cmplz_add_event("change", ".cmplz-accept-service", function(e) {
    var t = e.target,
        c = t.tagName,
        n = t.getAttribute("data-service");
    void 0 !== n && ("INPUT" === c ? (cmplz_set_banner_status("dismissed"), t.checked ? (cmplz_set_service_consent(n, !0), cmplz_enable_category("", n)) : (cmplz_set_service_consent(n, !1), setTimeout(function() {
        cmplz_reload_browser_compatible()
    }, 500))) : (e.preventDefault(), cmplz_set_service_consent(n, !0), cmplz_enable_category("", "general"), cmplz_enable_category("", n), setTimeout(function() {
        cmplz_reload_browser_compatible()
    }, 500))), cmplz_fire_categories_event(), cmplz_track_status()
}), cmplz_add_event("click", ".cmplz-save-preferences", function(e) {
    var t, c, n, o, a, e = e.target,
        i = (cmplz_banner = e.closest(".cmplz-cookiebanner"), []);
    for (t in cmplz_categories) cmplz_categories.hasOwnProperty(t) && (c = cmplz_categories[t], n = cmplz_banner.querySelector("input.cmplz-" + c)) && n.checked && i.push(c);
    for (o in cmplz_fire_before_categories_consent(i), cmplz_categories) cmplz_categories.hasOwnProperty(o) && (a = cmplz_categories[o], i.includes(a) ? cmplz_set_consent(a, "allow") : cmplz_set_consent(a, "deny"));
    cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status()
}), cmplz_add_event("click", ".cmplz-close", function(e) {
    cmplz_set_banner_status("dismissed")
}), cmplz_add_event("click", ".cmplz-view-preferences", function(e) {
    e = e.target;
    (cmplz_banner = e.closest(".cmplz-cookiebanner")).querySelector(".cmplz-categories").classList.contains("cmplz-fade-in") ? (cmplz_banner.classList.remove("cmplz-categories-visible"), cmplz_banner.querySelector(".cmplz-categories").classList.remove("cmplz-fade-in"), cmplz_banner.querySelector(".cmplz-view-preferences").style.display = "block", cmplz_banner.querySelector(".cmplz-save-preferences").style.display = "none") : (cmplz_banner.classList.add("cmplz-categories-visible"), cmplz_banner.querySelector(".cmplz-categories").classList.add("cmplz-fade-in"), cmplz_banner.querySelector(".cmplz-view-preferences").style.display = "none", cmplz_banner.querySelector(".cmplz-save-preferences").style.display = "block")
}), cmplz_add_event("change", ".cmplz-manage-consent-container .cmplz-category", function(e) {
    for (var t in cmplz_categories) {
        var c;
        cmplz_categories.hasOwnProperty(t) && (t = cmplz_categories[t], c = document.querySelector(".cmplz-manage-consent-container input.cmplz-" + t)) && (c.checked ? cmplz_set_consent(t, "allow") : cmplz_set_consent(t, "deny"), cmplz_set_banner_status("dismissed"), cmplz_fire_categories_event(), cmplz_track_status())
    }
}), cmplz_add_event("click", ".cmplz-deny", function(e) {
    e.preventDefault(), cmplz_set_banner_status("dismissed"), cmplz_deny_all()
}), cmplz_add_event("click", "button.cmplz-manage-settings", function(e) {
    e.preventDefault();
    var e = document.querySelector(".cmplz-cookiebanner .cmplz-categories"),
        t = document.querySelector(".cmplz-save-settings"),
        c = document.querySelector("button.cmplz-manage-settings");
    cmplz_is_hidden(e) ? (t.style.display = "block", c.style.display = "none", e.style.display = "block") : (t.style.display = "none", c.style.display = "block", e.style.display = "none")
}), cmplz_add_event("click", "button.cmplz-manage-consent", function(e) {
    e.preventDefault(), cmplz_set_banner_status("show")
});
var cmplzCleanCookieInterval, cmplz_cookie_data = [];

function cmplz_start_clean() {
    if (1 == complianz.clean_cookies)
        if ((cmplz_cookie_data = "undefined" != typeof Storage ? JSON.parse(sessionStorage.getItem("cmplz_cookie_data")) : cmplz_cookie_data) && 0 !== cmplz_cookie_data.length) cmplz_setup_clean_interval();
        else {
            let e = new XMLHttpRequest;
            e.open("GET", complianz.url + "cookie_data", !0), e.setRequestHeader("Content-type", "application/json"), e.send(), e.onload = function() {
                cmplz_cookie_data = JSON.parse(e.response), sessionStorage.setItem("cmplz_cookie_data", JSON.stringify(cmplz_cookie_data)), cmplz_setup_clean_interval()
            }
        }
}

function cmplz_do_cleanup() {
    for (const t of ["preferences", "statistics", "marketing"])
        if (!cmplz_has_consent(t) && cmplz_cookie_data.hasOwnProperty(t)) {
            var e = cmplz_cookie_data[t];
            for (const c in e)
                if (!cmplz_has_service_consent(c, t))
                    for (const n of e[c]) cmplz_clear_cookies(n), cmplz_clear_storage(n)
        }
}

function cmplz_setup_clean_interval() {
    !cmplz_cookie_data || cmplzCleanCookieInterval || (cmplz_do_cleanup(), cmplzCleanCookieInterval = setInterval(cmplz_do_cleanup, 1e3))
}

function cmplz_clear_storage(e) {
    "undefined" != typeof Storage && (localStorage.getItem(e) && localStorage.removeItem(e), sessionStorage.getItem(e)) && sessionStorage.removeItem(e)
}

function cmplz_load_manage_consent_container() {
    let c = document.querySelector(".cmplz-manage-consent-container");
    if (c) {
        let t = new XMLHttpRequest;
        t.open("GET", complianz.url + "manage_consent_html?" + complianz.locale, !0), t.setRequestHeader("Content-type", "application/json"), t.send(), t.onload = function() {
            var e = JSON.parse(t.response);
            c.insertAdjacentHTML("beforeend", e), cmplz_sync_category_checkboxes();
            document.querySelector("#cmplz-manage-consent-container-nojavascript").style.display = "none", c.style.display = "block";
            e = new CustomEvent("cmplz_manage_consent_container_loaded");
            document.dispatchEvent(e)
        }
    }
}

function cmplz_equals(c, n) {
    if (Array.isArray(c) || (c = Object.keys(c), n = Object.keys(n)), !c || !n) return !1;
    if (c.length !== n.length) return !1;
    for (let e = 0, t = c.length; e < t; e++)
        if (c[e] instanceof Array && n[e] instanceof Array) {
            if (!cmplz_equals(c[e], n[e])) return !1
        } else if (c[e] !== n[e]) return !1;
    return !0
}

function cmplzCopyAttributes(e, t) {
    const c = ["type", "data-service", "data-category", "async"];
    Array.from(e.attributes).forEach(e => {
        "data-script-type" === e.nodeName && "module" === e.nodeValue ? (t.setAttribute("type", "module"), t.removeAttribute("data-script-type")) : c.includes(e.nodeName) || t.setAttribute(e.nodeName, e.nodeValue)
    })
}
cmplz_add_event("keypress", ".cmplz-banner-slider label", function(e) {
    32 == (e.keyCode || e.which) && document.activeElement.click()
}), cmplz_add_event("keypress", ".cmplz-cookiebanner .cmplz-header .cmplz-close", function(e) {
    13 == (e.keyCode || e.which) && document.activeElement.click()
});
var cmplz_has_wp_video = document.querySelector(".cmplz-wp-video-shortcode"),
    cmplz_times_checked = 0;
void 0 !== window.jQuery && jQuery(document).ready(function(r) {
    if (cmplz_has_wp_video) {
        document.addEventListener("cmplz_enable_category", function(e) {
            t()
        });
        let e = setInterval(function() {
            cmplz_times_checked += 1, document.querySelector(".cmplz-wp-video-shortcode") && cmplz_times_checked < 100 ? t() : clearInterval(e)
        }, 500)
    }

    function t() {
        if (document.querySelector(".cmplz-wp-video-shortcode")) {
            var e, t, n, o = cmplz_accepted_categories(),
                a = cmplz_get_all_service_consents(),
                i = [];
            for (e in o)
                if (o.hasOwnProperty(e)) {
                    var l = o[e];
                    if ("functional" === l) break;
                    i.push('.cmplz-wp-video-shortcode[data-category="' + l + '"]')
                }
            for (t in a) a.hasOwnProperty(t) && i.push('.cmplz-wp-video-shortcode[data-service="' + t + '"]');
            n = i.join(",");
            let c = !1;
            0 < n.length && document.querySelectorAll(n).forEach(e => {
                c = !0, e.setAttribute("controls", "controls"), e.classList.add("wp-video-shortcode", "cmplz-processed"), e.classList.remove("cmplz-wp-video-shortcode"), e.closest(".cmplz-wp-video").classList.remove("cmplz-wp-video");
                var t = e.closest(".wp-video").querySelector(".cmplz-blocked-content-notice");
                t && t.parentElement.removeChild(t), e.classList.remove("cmplz-blocked-content-container")
            }), c && (window.wp.mediaelement ? window.wp.mediaelement.initialize() : (n = {
                videoWidth: "100%",
                videoHeight: "100%",
                enableAutosize: !0
            }, r(".wp-video-shortcode").mediaelementplayer(n)))
        }
    }

    function c(e) {
        e = r(e);
        "function" == typeof e.parent().fitVids && e.parent().fitVids()
    }
    document.querySelectorAll(".cmplz-video.cmplz-activated").forEach(e => {
        c(e)
    }), document.addEventListener("cmplz_enable_category", function(e) {
        document.querySelectorAll(".cmplz-video.cmplz-activated").forEach(e => {
            c(e)
        })
    })
});;