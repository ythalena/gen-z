/**
 * kk Star Ratings
 * @see https://github.com/kamalkhan/kk-star-ratings
 */
"use strict";
! function(t) {
    if ("loading" != document.readyState) return t();
    document.addEventListener("DOMContentLoaded", t)
}(function() {
    var t = !1;
    Array.prototype.forEach.call(document.querySelectorAll(".kk-star-ratings"), function e(n) {
        function r(r) {
            var c = {
                    rating: r.getAttribute("data-star")
                },
                i = JSON.parse(n.getAttribute("data-payload"));
            for (var s in i) c["payload[" + s + "]"] = i[s];
            ! function(e, n, r) {
                if (!t) {
                    t = !0, e = Object.assign({
                        nonce: kk_star_ratings.nonce,
                        action: kk_star_ratings.action
                    }, e);
                    var a = [];
                    for (var o in e) a.push(encodeURIComponent(o) + "=" + encodeURIComponent(e[o]));
                    var c = new XMLHttpRequest;
                    c.open("POST", kk_star_ratings.endpoint, !0), c.onload = function() {
                        c.status >= 200 && c.status < 400 ? n(c.responseText, c) : r(c.responseText, c)
                    }, c.onloadend = function() {
                        t = !1
                    }, c.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"), c.send(a.join("&"))
                }
            }(c, function(t) {
                var r = function(t) {
                    var e = document.createElement("div");
                    return e.innerHTML = t.trim(), e.firstChild
                }(t);
                n.parentNode.replaceChild(r, n), Array.prototype.forEach.call(o, function(t) {
                    t.removeEventListener("click", a)
                }), n = null, e(r)
            }, console.error)
        }

        function a(t) {
            t.preventDefault(), r(t.currentTarget)
        }
        var o = n.querySelectorAll("[data-star]");
        Array.prototype.forEach.call(o, function(t) {
            t.addEventListener("click", a)
        })
    })
});;