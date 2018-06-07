// selectLanguage will remember a given language as a preferred setting using a cookie and walk the DOM enabling
// all code tabs and snippets for this language, and disabling those for unselected languages.
function selectLanguage(lang) {
    $(function() {
        document.cookie = "pulumi_language=" + lang;

        // Change the active tab.
        var langTabs = 0;
        $("a").each(function (i, e) {
            var classes = ($(e).attr("class") || "").split(/\s+/);
            for (var i = 0; i < classes.length; i++) {
                if (classes[i] === "langtab") {
                    langTabs++;
                    if (e.innerText.toLowerCase() === lang) {
                        $(e).addClass("is-active");
                    } else {
                        $(e).removeClass("is-active");
                    }
                    break;
                }
            }
        });

        // If and only if we found tabs, hide divs for the relevant languages.
        if (langTabs > 0) {
            $("div").each(function (i, e) {
                var classes = ($(e).attr("class") || "").split(/\s+/);
                for (var i = 0; i < classes.length; i++) {
                    if (classes[i].startsWith("language-")) {
                        if (classes[i] === "language-"+lang) {
                            $(e).show();
                        } else {
                            $(e).hide();
                        }
                        break;
                    }
                }
            });
        }
    });
}

// The first time the DOM is finished loading, select the right language.  If no language is set as the preferred
// language yet, then JavaScript is chosen as the preferred language as a default.
$(function() {
    // For every language tab, inject a handler and make the correct one hidden.
    $("a").each(function (i, e) {
        var classes = ($(e).attr("class") || "").split(/\s+/);
        for (var i = 0; i < classes.length; i++) {
            if (classes[i] === "langtab") {
                var lang = e.innerText.toLowerCase();
                e.addEventListener('click', function() {
                    selectLanguage(lang);
                });
                break;
            }
        }
    });

    // Now select the right language based on whether there's a cookie (defaulting to JavaScript).
    var langCookie = decodeURIComponent(
        document.cookie.replace(/(?:(?:^|.*;\s*)pulumi_language\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
    if (langCookie) {
        selectLanguage(langCookie);
    } else {
        selectLanguage("javascript");
    }
});