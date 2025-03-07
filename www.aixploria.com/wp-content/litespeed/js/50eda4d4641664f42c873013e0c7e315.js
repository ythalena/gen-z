! function(s) {
    "use strict";
    s(window).on("load", function() {
        if (s(".is-menu a, .is-menu a svg").on("click", function(e) {
                if (e.stopPropagation(), e.preventDefault(), "static" === s(this).closest("ul").css("position") && s(this).closest("ul").css("position", "relative"), s(this).closest(".is-menu-wrapper").length && (s(this).closest(".is-menu").hasClass("sliding") || s(this).closest(".is-menu").hasClass("full-width-menu")) && s(this).closest(".is-menu-wrapper").addClass("is-expanded"), s(this).closest(".is-menu").hasClass("sliding") || s(this).closest(".is-menu").hasClass("full-width-menu")) {
                    s(this).closest(".is-menu").find("button.is-search-submit").hide();
                    var i = s(this).closest("li.is-menu").outerHeight();
                    i /= 2, s(this).closest(".is-menu").find("form").css({
                        top: i - 18 + "px"
                    }), s(this).closest(".is-menu").find(".search-close").css({
                        top: i - 10 + "px"
                    })
                }
                if (s(this).closest(".is-menu").hasClass("is-dropdown")) s(this).closest(".is-menu").find("form").fadeIn();
                else if (s(this).closest(".is-menu").hasClass("sliding")) s(this).closest(".is-menu").find("form").animate({
                    width: "310"
                }, function() {
                    s(this).closest(".is-menu").addClass("open"), s(this).closest(".is-menu").find("button.is-search-submit").show()
                });
                else if (s(this).closest(".is-menu").hasClass("full-width-menu")) {
                    var t = s(this).closest("ul").outerWidth();
                    if (s(this).closest(".is-menu-wrapper").hasClass("is-expanded")) t = s(window).width(), s(this).closest(".is-menu").find("form").css("right", "-5px"), s(this).closest(".is-menu").find(".search-close").hide();
                    else {
                        var a = s(this).offset();
                        if (!s(this).closest(".is-menu").hasClass("is-first") && a.left < t) {
                            t = a.left;
                            var n = s(this).closest("li").outerWidth();
                            n > t && (t = n)
                        }
                    }
                    s(this).closest(".is-menu").find("form").animate({
                        width: t + "px"
                    }, function() {
                        s(this).closest(".is-menu").addClass("active-search"), s(this).closest(".is-menu").addClass("open"), s(this).closest(".is-menu").find("button.is-search-submit").show()
                    })
                } else s(this).closest(".is-menu").hasClass("popup") && (s("#is-popup-wrapper").fadeIn(), s('#is-popup-wrapper form input[type="text"], #is-popup-wrapper form input[type="search"]').focus());
                (s(this).closest(".is-menu").hasClass("sliding") || s(this).closest(".is-menu").hasClass("full-width-menu")) && s(this).closest(".is-menu").find('form input[type="search"], form input[type="text"]').focus(), s(this).closest(".is-menu").find('form input[type="search"], form input[type="text"]').focus()
            }), s("#is-popup-wrapper .popup-search-close").on("click", function(e) {
                s("#is-popup-wrapper, .is-ajax-search-result, .is-ajax-search-details").fadeOut()
            }), "undefined" != typeof IvorySearchVars && void 0 !== IvorySearchVars.is_analytics_enabled && void 0 !== IvorySearchVars.is_search && (IvorySearchVars.is_search, 1)) {
            var e, i = void 0 !== IvorySearchVars.is_id ? IvorySearchVars.is_id : "Default";
            ivory_search_analytics(i, void 0 !== IvorySearchVars.is_label ? IvorySearchVars.is_label : "", void 0 !== IvorySearchVars.is_cat ? IvorySearchVars.is_cat : "")
        }
        window.matchMedia("(max-width: 1024px)").matches && s(".is-menu a").attr("href", ""), s(window).resize(function() {
            window.matchMedia("(max-width: 1024px)").matches && s(".is-menu a").attr("href", "")
        })
    }), s(document).keyup(function(e) {
        27 === e.keyCode && s("#is-popup-wrapper, .is-ajax-search-result, .is-ajax-search-details").hide()
    }), s('.is-menu form input[type="search"], .is-menu form input[type="text"]').on("click", function(s) {
        return s.stopPropagation(), !1
    }), s("form.is-search-form, form.search-form").on("mouseover", function(e) {
        s(this).next(".is-link-container").length && s(this).append(s(this).next(".is-link-container").remove())
    }), s(window).click(function(e) {
        0 === e.button && 0 === s(e.target).closest(".is-search-input").length && 0 === s(e.target).closest(".is-search-submit").length && 0 === s(e.target).closest(".is-ajax-search-result").length && 0 === s(e.target).closest(".is-ajax-search-details").length && (s(".is-menu").hasClass("open") ? (s(".is-menu button.is-search-submit").hide(), s(".is-menu form").animate({
            width: "0"
        }, 400, function() {
            s(".is-menu").removeClass("active-search"), s(".is-menu").removeClass("open"), s(".is-menu-wrapper").removeClass("is-expanded")
        }), s(".is-ajax-search-result, .is-ajax-search-details").hide()) : s(".is-menu").hasClass("is-dropdown") && (s(".is-menu form").fadeOut(), s(".is-ajax-search-result, .is-ajax-search-details").hide()))
    })
}(jQuery);

function ivory_search_analytics(s, e, i) {
    try {
        var t = "function" == typeof __gaTracker ? __gaTracker : "function" == typeof ga && ga,
            a = "function" == typeof gtag && gtag;
        if (!1 !== a) {
            a("event", "Ivory Search - " + s, {
                event_label: e,
                event_category: i
            });
            return
        }!1 !== t && t("send", {
            hitType: "event",
            eventCategory: i,
            eventAction: "Ivory Search - " + s,
            eventLabel: e
        })
    } catch (n) {}
};