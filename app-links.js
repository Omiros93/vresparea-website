// Shared logic for the /game/ and /invite/ landing pages.
// Builds "open in app" links for the VresParea app (scheme vresparea://,
// package gr.vresparea.app). On Android an intent:// link opens the app when
// it's installed and falls back to the Play Store otherwise.
(function () {
  var PACKAGE = 'gr.vresparea.app';
  var SCHEME = 'vresparea';
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=' + PACKAGE;

  var ua = navigator.userAgent || '';
  var platform = /android/i.test(ua) ? 'android'
    : (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && 'ontouchend' in document)) ? 'ios'
    : 'desktop';

  // path: in-app route without leading slash, e.g. "game/<uuid>"
  function openAppUrl(path) {
    if (platform === 'android') {
      return 'intent://' + path + '#Intent;scheme=' + SCHEME + ';package=' + PACKAGE +
        ';S.browser_fallback_url=' + encodeURIComponent(PLAY_URL) + ';end';
    }
    return SCHEME + '://' + path;
  }

  function param(name) {
    try { return new URLSearchParams(window.location.search).get(name) || ''; }
    catch (e) { return ''; }
  }

  function show(id) { var el = document.getElementById(id); if (el) el.hidden = false; }
  function hide(id) { var el = document.getElementById(id); if (el) el.hidden = true; }
  function setHref(id, href) { var el = document.getElementById(id); if (el) el.setAttribute('href', href); }

  window.VresParea = {
    platform: platform,
    playUrl: PLAY_URL,
    openAppUrl: openAppUrl,
    param: param,
    show: show,
    hide: hide,
    setHref: setHref,
    isGameId: function (s) { return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s); },
    isInviteCode: function (s) { return /^[A-Z0-9]{4,16}$/i.test(s); },
    // Show the right store/app buttons for this device.
    applyPlatform: function () {
      setHref('play-link', PLAY_URL);
      if (platform === 'android') { show('play-link'); }
      if (platform === 'ios') { show('ios-note'); }
      if (platform === 'desktop') { show('play-link'); show('desktop-note'); }
    }
  };
})();
