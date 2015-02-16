var CONST_LOGGED_IN = "LoggedIn1";

var objCookies = {
	Create: function(name, val, days){
		alert("name: " + name);
		alert("val: " + val);
		alert("days: " + days);
		// $.cookie(val, name, { expires: days });
		$.cookie(name, val, { expires: days });
		return;
		var d = new Date();
		d.setTime(d.getTime() + (days * 24 * 60 * 60 *1000));
		var expires = "expires=" + d.toUTCString();
		document.cookie = name + "=" + val + "; " + expires;
	},
	Get: function(name){
		return $.cookie(name);
		
		var name = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return "";
	},
	Delete: function(name) {
		$.removeCookie(name);
		return;
		objCookies.Create(name, "");
		objCookies.Create(name, "", 0);
	},
	IsExist: function(name){
		alert("account.js -> 33:" + $.cookie(name));
		return ($.cookie(name) != null &&$.cookie(name).length > 0);
		
		if (objCookies.Get(CONST_LOGGED_IN) == null) return false;
		if (objCookies.Get(CONST_LOGGED_IN).length > 0) return true;
		
		return false;
	}
};

var BaseActions = {
	VerifyLogin: function() {		
		// don't do
		alert("account.js -> 43");
		var isLoggedIn = objCookies.IsExist(CONST_LOGGED_IN);
		var currentPath = window.location.href.split('/')[window.location.href.split('/').length-1];
		
		alert("cookie data: " + objCookies.Get(CONST_LOGGED_IN));
		
		if (currentPath.indexOf('/') == -1 && currentPath.indexOf('index.html') == -1) {
			alert("1: " + window.location.href);
			BaseActions.LoadIndex();
		}
		
		if (isLoggedIn) {
			alert("2: " + window.location.href);
			if (currentPath.inedxOf('index.html') > -1) {
				alert("3: " + window.location.href);
				BaseActions.LoadSearch();
			}
		} else {
			alert("4: " + window.location.href);
			if (currentPath.indexOf('index.html') == -1) {
				alert("5: " + window.location.href);
				BaseActions.LoadIndex();
			}
		}
	},
	Logout: function(){
		objCookies.Delete(CONST_LOGGED_IN);
		BaseActions.VerifyLogin();
	},
	LoadIndex: function(){
		$("#LinkNav a[name='index']").click();
	},
	LoadSearch: function(){
		$("#LinkNav a[name='search']").click();
	},
	LoadSearchHistory: function(){
		$("#LinkNav a[name='searchHistory']").click();
	},
	LoadInsert: function(){
		$("#LinkNav a[name='insert']").click();
	},
}
BaseActions.VerifyLogin();