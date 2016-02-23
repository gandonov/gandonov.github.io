Framework = {
    templateCache: {},
    CACHE_TEMPLATES: false,
    loadCompressed: function(str) {
        var iBegin = str.indexOf('fudgepacker1911begin');
        var iEnd = str.indexOf('fudgepacker1911end');
        var tokens = str.substring(iBegin + 21, iEnd - 1).split(" ");
        var prev = 0;
        for (var i = 0; i < tokens.length; i += 2) {
            this.templateCache[tokens[i + 1]] = str.substring(prev, tokens[i]);
            prev = tokens[i];
        }
        
    }
}
